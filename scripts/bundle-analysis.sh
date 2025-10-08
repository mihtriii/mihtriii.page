#!/bin/bash

# Advanced Bundle Analysis Script
# Analyzes bundle size, dependencies, and suggests optimizations

echo "📊 Starting comprehensive bundle analysis..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_dependencies() {
    echo "🔍 Checking dependencies..."
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is required but not installed.${NC}"
        exit 1
    fi
    
    # Install bundle analyzer if not present
    if ! npm list webpack-bundle-analyzer &> /dev/null; then
        echo "📦 Installing webpack-bundle-analyzer..."
        npm install --save-dev webpack-bundle-analyzer
    fi
    
    # Install source-map-explorer if not present
    if ! npm list source-map-explorer &> /dev/null; then
        echo "📦 Installing source-map-explorer..."
        npm install --save-dev source-map-explorer
    fi
    
    echo -e "${GREEN}✅ Dependencies ready${NC}"
}

# Build the project
build_project() {
    echo "🏗️  Building project for analysis..."
    
    # Clean previous builds
    rm -rf dist
    
    # Build with source maps enabled
    npm run build
    
    if [ ! -d "dist" ]; then
        echo -e "${RED}❌ Build failed!${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Build completed${NC}"
}

# Analyze bundle size
analyze_bundle_size() {
    echo "📈 Analyzing bundle sizes..."
    
    # Create analysis directory
    mkdir -p analysis
    
    # Get basic file sizes
    echo "📊 File sizes:" > analysis/bundle-report.txt
    find dist -name "*.js" -o -name "*.css" | while read file; do
        size=$(du -h "$file" | cut -f1)
        echo "  $file: $size" >> analysis/bundle-report.txt
    done
    
    # Calculate total bundle size
    total_js=$(find dist -name "*.js" -exec cat {} \; | wc -c | awk '{print $1/1024/1024 " MB"}')
    total_css=$(find dist -name "*.css" -exec cat {} \; | wc -c | awk '{print $1/1024/1024 " MB"}')
    
    echo "" >> analysis/bundle-report.txt
    echo "📊 Total JavaScript: $total_js" >> analysis/bundle-report.txt
    echo "📊 Total CSS: $total_css" >> analysis/bundle-report.txt
    
    # Analyze with webpack-bundle-analyzer
    if [ -f "dist/assets/index-*.js" ]; then
        echo "🔍 Running webpack bundle analyzer..."
        npx webpack-bundle-analyzer dist/assets/index-*.js --mode=static --report=analysis/bundle-analyzer.html --open=false
        echo -e "${GREEN}✅ Bundle analyzer report saved to analysis/bundle-analyzer.html${NC}"
    fi
    
    # Display results
    cat analysis/bundle-report.txt
}

# Check for unused dependencies
check_unused_dependencies() {
    echo "🔍 Checking for unused dependencies..."
    
    # Install depcheck if not present
    if ! npm list depcheck &> /dev/null; then
        echo "📦 Installing depcheck..."
        npm install --save-dev depcheck
    fi
    
    # Run depcheck
    npx depcheck --json > analysis/depcheck.json 2>/dev/null
    
    # Parse results
    unused_deps=$(cat analysis/depcheck.json | node -e "
        const data = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
        const unused = data.dependencies || [];
        if (unused.length > 0) {
            console.log('🗑️  Unused dependencies:');
            unused.forEach(dep => console.log('  - ' + dep));
        } else {
            console.log('✅ No unused dependencies found');
        }
    ")
    
    echo "$unused_deps"
    echo "$unused_deps" >> analysis/bundle-report.txt
}

# Analyze performance opportunities
analyze_performance_opportunities() {
    echo "⚡ Analyzing performance opportunities..."
    
    opportunities_file="analysis/performance-opportunities.txt"
    echo "🎯 Performance Optimization Opportunities:" > $opportunities_file
    echo "" >> $opportunities_file
    
    # Check for large files that could be code-split
    large_files=$(find dist -name "*.js" -size +100k | head -5)
    if [ ! -z "$large_files" ]; then
        echo "📦 Large JavaScript files (>100KB) - Consider code splitting:" >> $opportunities_file
        echo "$large_files" | while read file; do
            size=$(du -h "$file" | cut -f1)
            echo "  - $file ($size)" >> $opportunities_file
        done
        echo "" >> $opportunities_file
    fi
    
    # Check for potential lazy loading opportunities
    echo "🔄 Potential lazy loading improvements:" >> $opportunities_file
    echo "  - Implement lazy loading for non-critical components" >> $opportunities_file
    echo "  - Use React.lazy() for route-based code splitting" >> $opportunities_file
    echo "  - Lazy load third-party libraries" >> $opportunities_file
    echo "" >> $opportunities_file
    
    # Check for image optimization opportunities
    image_count=$(find dist -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" | wc -l)
    if [ $image_count -gt 0 ]; then
        echo "🖼️  Image optimization opportunities:" >> $opportunities_file
        echo "  - Convert images to WebP format" >> $opportunities_file
        echo "  - Implement responsive image srcSet" >> $opportunities_file
        echo "  - Use lazy loading for images" >> $opportunities_file
        echo "" >> $opportunities_file
    fi
    
    # Display opportunities
    cat $opportunities_file
}

# Generate optimization recommendations
generate_recommendations() {
    echo "💡 Generating optimization recommendations..."
    
    recommendations_file="analysis/recommendations.md"
    
    cat > $recommendations_file << 'EOF'
# 🚀 Bundle Optimization Recommendations

## 📊 Current Analysis Results

### Bundle Size Analysis
- Check `bundle-analyzer.html` for detailed breakdown
- Large files should be considered for code splitting
- Monitor Core Web Vitals impact

### Performance Opportunities

#### 1. Code Splitting Strategies
```javascript
// Route-based splitting
const LazyHome = React.lazy(() => import('./pages/Home'));
const LazyBlog = React.lazy(() => import('./pages/Blog'));

// Component-based splitting
const LazyChart = React.lazy(() => import('./components/Chart'));
```

#### 2. Bundle Size Reduction
- Remove unused dependencies with `npm uninstall <package>`
- Use tree shaking for libraries that support it
- Consider lighter alternatives for heavy libraries

#### 3. Performance Optimizations
- Implement service worker caching
- Use `React.memo()` for expensive components
- Optimize images with WebP format
- Enable gzip/brotli compression

#### 4. Monitoring Setup
- Set up bundle size monitoring in CI/CD
- Track Core Web Vitals in production
- Monitor loading performance metrics

## 🎯 Quick Wins

1. **Lazy Load Non-Critical Components**
   ```javascript
   const NonCritical = React.lazy(() => import('./NonCritical'));
   ```

2. **Optimize Images**
   ```bash
   # Convert to WebP
   npx @squoosh/cli --webp auto src/assets/images/*.{jpg,png}
   ```

3. **Remove Unused CSS**
   ```bash
   npx purgecss --css dist/**/*.css --content dist/**/*.html
   ```

4. **Enable Compression**
   Configure your server to enable gzip/brotli compression

## 📈 Monitoring

Set up regular bundle analysis:
```bash
# Add to package.json scripts
"analyze": "./scripts/bundle-analysis.sh",
"analyze:size": "bundlesize",
"analyze:deps": "depcheck"
```

## 🔗 Resources

- [Web.dev Bundle Analysis](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
- [React Code Splitting](https://reactjs.org/docs/code-splitting.html)
- [Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)
EOF

    echo -e "${GREEN}✅ Recommendations saved to analysis/recommendations.md${NC}"
}

# Create performance budget file
create_performance_budget() {
    echo "📏 Creating performance budget..."
    
    cat > analysis/performance-budget.json << 'EOF'
{
  "budget": {
    "javascript": {
      "max": "250KB",
      "warning": "200KB"
    },
    "css": {
      "max": "50KB", 
      "warning": "40KB"
    },
    "images": {
      "max": "500KB",
      "warning": "400KB"
    },
    "fonts": {
      "max": "100KB",
      "warning": "80KB"
    }
  },
  "metrics": {
    "FCP": {
      "max": 2000,
      "warning": 1500
    },
    "LCP": {
      "max": 2500,
      "warning": 2000
    },
    "CLS": {
      "max": 0.1,
      "warning": 0.05
    },
    "FID": {
      "max": 100,
      "warning": 50
    }
  }
}
EOF

    echo -e "${GREEN}✅ Performance budget created${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Advanced Bundle Analysis Tool${NC}"
    echo "=================================="
    
    check_dependencies
    build_project
    analyze_bundle_size
    check_unused_dependencies
    analyze_performance_opportunities
    generate_recommendations
    create_performance_budget
    
    echo ""
    echo -e "${GREEN}✨ Analysis complete!${NC}"
    echo ""
    echo "📁 Results saved in './analysis/' directory:"
    echo "  - bundle-analyzer.html (visual bundle breakdown)"
    echo "  - bundle-report.txt (size summary)"
    echo "  - recommendations.md (optimization guide)"
    echo "  - performance-budget.json (performance targets)"
    echo ""
    echo "🌐 To view bundle analyzer:"
    echo "  open analysis/bundle-analyzer.html"
    echo ""
    echo "📊 To monitor bundle size in CI/CD, add this to package.json:"
    echo '  "bundlesize": [{ "path": "./dist/assets/*.js", "maxSize": "250KB" }]'
}

# Run main function
main "$@"