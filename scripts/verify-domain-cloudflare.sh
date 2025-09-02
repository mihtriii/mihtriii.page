#!/usr/bin/env bash
set -euo pipefail

# Creates/updates DNS records on Cloudflare for GitHub Pages domain verification and pointing.
# Requirements:
# - env: CF_API_TOKEN, CF_ZONE_ID, DOMAIN, GITHUB_USERNAME, CHALLENGE
# - optional env: SUBDOMAIN (e.g. www). If set → create CNAME SUBDOMAIN -> <user>.github.io
#                 If unset → create A/AAAA at apex DOMAIN to GitHub Pages IPs
#
# Example:
#   export CF_API_TOKEN=... CF_ZONE_ID=... DOMAIN="mihtriii.dev" \
#          GITHUB_USERNAME="mihtriii" CHALLENGE="040d0d1584862249da47eddfe2f931" SUBDOMAIN="www"
#   bash scripts/verify-domain-cloudflare.sh

need() { [ -n "${!1:-}" ] || { echo "Missing env: $1"; exit 1; }; }
need CF_API_TOKEN; need CF_ZONE_ID; need DOMAIN; need GITHUB_USERNAME; need CHALLENGE;

API="https://api.cloudflare.com/client/v4"
auth=( -H "Authorization: Bearer $CF_API_TOKEN" -H 'Content-Type: application/json' )

echo "# Upserting TXT verification record..."
TXT_NAME="_github-pages-challenge-${GITHUB_USERNAME}.${DOMAIN}"
payload=$(jq -n --arg type TXT --arg name "$TXT_NAME" --arg content "$CHALLENGE" '{type:$type,name:$name,content:$content,ttl:300}')

existing_id=$(curl -fsS -G "$API/zones/$CF_ZONE_ID/dns_records" "${auth[@]}" --data-urlencode "type=TXT" --data-urlencode "name=$TXT_NAME" | jq -r '.result[0]?.id // empty') || true
if [ -n "$existing_id" ]; then
  curl -fsS -X PUT "$API/zones/$CF_ZONE_ID/dns_records/$existing_id" "${auth[@]}" --data "$payload" >/dev/null
  echo "Updated TXT $TXT_NAME"
else
  curl -fsS -X POST "$API/zones/$CF_ZONE_ID/dns_records" "${auth[@]}" --data "$payload" >/dev/null
  echo "Created TXT $TXT_NAME"
fi

if [ -n "${SUBDOMAIN:-}" ]; then
  echo "# Upserting CNAME ${SUBDOMAIN}.${DOMAIN} -> ${GITHUB_USERNAME}.github.io"
  CNAME_FQDN="${SUBDOMAIN}.${DOMAIN}"
  payload=$(jq -n --arg type CNAME --arg name "$CNAME_FQDN" --arg content "${GITHUB_USERNAME}.github.io" '{type:$type,name:$name,content:$content,ttl:300,proxied:false}')
  existing_id=$(curl -fsS -G "$API/zones/$CF_ZONE_ID/dns_records" "${auth[@]}" --data-urlencode "type=CNAME" --data-urlencode "name=$CNAME_FQDN" | jq -r '.result[0]?.id // empty') || true
  if [ -n "$existing_id" ]; then
    curl -fsS -X PUT "$API/zones/$CF_ZONE_ID/dns_records/$existing_id" "${auth[@]}" --data "$payload" >/dev/null
    echo "Updated CNAME $CNAME_FQDN"
  else
    curl -fsS -X POST "$API/zones/$CF_ZONE_ID/dns_records" "${auth[@]}" --data "$payload" >/dev/null
    echo "Created CNAME $CNAME_FQDN"
  fi
else
  echo "# Upserting A/AAAA records for apex ${DOMAIN}"
  for ip in 185.199.108.153 185.199.109.153 185.199.110.153 185.199.111.153; do
    payload=$(jq -n --arg type A --arg name "$DOMAIN" --arg content "$ip" '{type:$type,name:$name,content:$content,ttl:300,proxied:false}')
    existing_id=$(curl -fsS -G "$API/zones/$CF_ZONE_ID/dns_records" "${auth[@]}" --data-urlencode "type=A" --data-urlencode "name=$DOMAIN" --data-urlencode "content=$ip" | jq -r '.result[0]?.id // empty') || true
    if [ -n "$existing_id" ]; then
      curl -fsS -X PUT "$API/zones/$CF_ZONE_ID/dns_records/$existing_id" "${auth[@]}" --data "$payload" >/dev/null
      echo "Ensured A $DOMAIN -> $ip"
    else
      curl -fsS -X POST "$API/zones/$CF_ZONE_ID/dns_records" "${auth[@]}" --data "$payload" >/dev/null
      echo "Created A $DOMAIN -> $ip"
    fi
  done
  for ip6 in 2606:50c:8000::153 2606:50c:8001::153 2606:50c:8002::153 2606:50c:8003::153; do
    payload=$(jq -n --arg type AAAA --arg name "$DOMAIN" --arg content "$ip6" '{type:$type,name:$name,content:$content,ttl:300,proxied:false}')
    existing_id=$(curl -fsS -G "$API/zones/$CF_ZONE_ID/dns_records" "${auth[@]}" --data-urlencode "type=AAAA" --data-urlencode "name=$DOMAIN" --data-urlencode "content=$ip6" | jq -r '.result[0]?.id // empty') || true
    if [ -n "$existing_id" ]; then
      curl -fsS -X PUT "$API/zones/$CF_ZONE_ID/dns_records/$existing_id" "${auth[@]}" --data "$payload" >/dev/null
      echo "Ensured AAAA $DOMAIN -> $ip6"
    else
      curl -fsS -X POST "$API/zones/$CF_ZONE_ID/dns_records" "${auth[@]}" --data "$payload" >/dev/null
      echo "Created AAAA $DOMAIN -> $ip6"
    fi
  done
fi

echo "# Done. DNS may take time to propagate. Use: dig +short TXT $TXT_NAME"

