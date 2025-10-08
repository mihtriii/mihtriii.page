#!/bin/bash

# PWA Build and Deployment Script
# Builds the application with PWA optimizations and validates implementation

echo "🚀 Building PWA with optimizations..."

# Clean previous builds
rm -rf dist

# Build the application
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed! Please check for errors."
    exit 1
fi

echo "✅ Build successful!"

# Validate PWA requirements
echo "🔍 Validating PWA implementation..."

# Check for required PWA files
if [ ! -f "dist/manifest.json" ]; then
    echo "❌ manifest.json not found in build"
    exit 1
fi

if [ ! -f "dist/sw.js" ]; then
    echo "❌ Service Worker not found in build"
    exit 1
fi

# Check for required icons
if [ ! -f "dist/assets/avatar.svg" ]; then
    echo "⚠️  Warning: Icon assets may not be properly copied"
fi

echo "✅ PWA files validated!"

# Display build size information
echo "📊 Build size analysis:"
du -sh dist/
echo ""
echo "📱 PWA ready for deployment!"
echo ""
echo "🌐 To test locally:"
echo "   npx serve dist"
echo ""
echo "🚀 Deploy the 'dist' folder to your hosting service"
echo "   - GitHub Pages: Copy contents to gh-pages branch"
echo "   - Netlify: Drag and drop 'dist' folder"
echo "   - Vercel: Deploy from this directory"

# Generate deployment manifest
cat > dist/deployment-info.json << EOF
{
  "buildTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "features": [
    "Progressive Web App (PWA)",
    "Service Worker with offline support",
    "Blog search and filtering",
    "Advanced theme system (6 themes)",
    "Mobile-optimized experience",
    "SEO optimization",
    "Internationalization (EN/VI)",
    "Advanced animations",
    "Install prompts",
    "Background sync"
  ],
  "size": "$(du -sh dist/ | cut -f1)",
  "ready": true
}
EOF

echo "✨ Deployment info saved to dist/deployment-info.json"