// Sitemap generator for static deployment
import fs from 'fs';
import path from 'path';

const baseUrl = 'https://mihtriii.github.io';

// Get all blog posts
function getBlogPosts() {
  const blogDir = path.join(process.cwd(), 'src/blog');
  const files = fs.readdirSync(blogDir);
  
  return files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const slug = file.replace('.mdx', '');
      const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
      
      // Extract date from meta export
      const metaMatch = content.match(/export const meta = {([^}]+)}/s);
      let date = new Date().toISOString();
      
      if (metaMatch) {
        const dateMatch = metaMatch[1].match(/date:\s*['"`]([^'"`]+)['"`]/);
        if (dateMatch) {
          date = new Date(dateMatch[1]).toISOString();
        }
      }
      
      return {
        slug,
        lastmod: date,
      };
    });
}

// Generate sitemap
function generateSitemap() {
  const staticPages = [
    {
      url: '',
      changefreq: 'weekly',
      priority: '1.0',
      lastmod: new Date().toISOString(),
    },
    {
      url: '/blog',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: new Date().toISOString(),
    },
    {
      url: '/cv',
      changefreq: 'monthly',
      priority: '0.9',
      lastmod: new Date().toISOString(),
    },
    {
      url: '/repos',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: new Date().toISOString(),
    },
  ];

  const blogPosts = getBlogPosts().map(post => ({
    url: `/blog/${post.slug}`,
    changefreq: 'monthly',
    priority: '0.6',
    lastmod: post.lastmod,
  }));

  const allPages = [...staticPages, ...blogPosts];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod.split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return sitemap;
}

// Generate robots.txt
function generateRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;
}

// Write files
function writeSitemapFiles() {
  const publicDir = path.join(process.cwd(), 'public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Write sitemap.xml
  fs.writeFileSync(
    path.join(publicDir, 'sitemap.xml'),
    generateSitemap(),
    'utf8'
  );
  
  // Write robots.txt
  fs.writeFileSync(
    path.join(publicDir, 'robots.txt'),
    generateRobotsTxt(),
    'utf8'
  );
  
  console.log('✅ Generated sitemap.xml and robots.txt');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  writeSitemapFiles();
}

export { generateSitemap, generateRobotsTxt, writeSitemapFiles };