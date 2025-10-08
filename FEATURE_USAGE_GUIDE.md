# 🎯 How to Use New Features - Hướng dẫn sử dụng tính năng mới

## 🔧 **Currently Active Features (Working):**

### ✅ **1. Basic Website Features:**
- ✨ **6 Theme System** - Click gear icon to switch themes
- 📱 **Mobile Tab Bar** - Bottom navigation on mobile devices  
- 🎨 **Progressive Web App** - Install prompt and offline support
- 🔄 **Page Transitions** - Smooth animations between pages
- 🌍 **Internationalization** - Vietnamese/English support
- 📊 **SEO Optimization** - Meta tags and structured data

### ✅ **2. Performance Features:**
- ⚡ **Lazy Loading** - Components load only when needed
- 🎯 **Service Worker** - PWA offline capabilities
- 📈 **Core Web Vitals** - Automatic performance tracking

## 🚀 **How to Add Advanced Features:**

### **📈 Performance Monitoring:**
```jsx
// In any component - add performance tracking
import { usePerformanceMonitor } from './utils/performance.js';

function MyComponent() {
  const { trackUserInteraction, trackPageView } = usePerformanceMonitor();
  
  const handleClick = () => {
    trackUserInteraction('button_click', { component: 'MyComponent' });
  };
  
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);
}
```

### **🖼️ Optimized Images:**
```jsx
// Replace regular img tags with OptimizedImage
import OptimizedImage from './components/OptimizedImage.jsx';

// Before:
<img src="/image.jpg" alt="Description" />

// After:
<OptimizedImage 
  src="/image.jpg" 
  alt="Description"
  priority={true}     // For above-fold images
  blur={true}         // Show blur placeholder
  width="400px"
  height="300px"
/>
```

### **⚡ Lazy Loading Components:**
```jsx
// Lazy load heavy components
import { withLazyLoading, LoadingSkeleton } from './components/LazyLoad.jsx';

const HeavyChart = withLazyLoading(
  () => import('./HeavyChart.jsx'),
  { 
    fallback: <LoadingSkeleton lines={4} height="200px" />,
    minHeight: '200px'
  }
);

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <HeavyChart /> {/* Will lazy load */}
    </div>
  );
}
```

### **♿ Accessibility Features:**
```jsx
// Add accessibility features
import { 
  AccessibilityProvider, 
  AccessibilityToggle, 
  SkipLink 
} from './components/AccessibilityFeatures.jsx';

function App() {
  return (
    <AccessibilityProvider>
      <SkipLink />
      <AccessibilityToggle /> {/* Alt + A to open */}
      <main id="main-content">
        {/* Your content */}
      </main>
    </AccessibilityProvider>
  );
}
```

### **✨ Advanced Animations:**
```jsx
// Add cool animations
import { 
  FloatingElement, 
  GlitchText, 
  MagneticElement,
  ParallaxElement 
} from './components/AdvancedAnimations.jsx';

function Hero() {
  return (
    <div>
      <FloatingElement intensity={1.5}>
        <h1>
          <GlitchText trigger="hover">
            Hover for glitch effect!
          </GlitchText>
        </h1>
      </FloatingElement>
      
      <MagneticElement strength={0.3}>
        <button>Magnetic Button</button>
      </MagneticElement>
      
      <ParallaxElement speed={0.5}>
        <img src="/background.jpg" />
      </ParallaxElement>
    </div>
  );
}
```

### **⏳ Loading Animations:**
```jsx
// Beautiful loading states
import { 
  ShimmerSkeleton, 
  LoadingSpinner, 
  ProgressCircle,
  TypewriterEffect 
} from './components/LoadingAnimations.jsx';

function MyComponent() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  if (loading) {
    return (
      <div>
        <ShimmerSkeleton lines={3} height="2rem" />
        <LoadingSpinner variant="pulse" size="large" />
        <ProgressCircle percentage={progress} size={100} />
      </div>
    );
  }
  
  return (
    <TypewriterEffect 
      text="Hello, World!" 
      speed={100}
      onComplete={() => console.log('Done!')}
    />
  );
}
```

### **📝 Content Management:**
```jsx
// Rich blog editor
import { BlogEditor, ImageUploader } from './components/ContentManagement.jsx';

function AdminPanel() {
  const handleSave = async (postData) => {
    // Save to your backend
    console.log('Saving:', postData);
  };
  
  return (
    <div>
      <BlogEditor 
        initialContent=""
        onSave={handleSave}
        onCancel={() => history.back()}
      />
      
      <ImageUploader 
        onUpload={async (file) => {
          // Upload to your server
          const url = await uploadToServer(file);
          return url;
        }}
        maxSize={5 * 1024 * 1024} // 5MB
      />
    </div>
  );
}
```

### **📊 Analytics Dashboard:**
```jsx
// Real-time analytics
import AnalyticsDashboard, { useAnalytics } from './components/Analytics.jsx';

function Dashboard() {
  return <AnalyticsDashboard className="my-4" />;
}

// Track custom events
function MyComponent() {
  const { trackEvent, trackUserInteraction } = useAnalytics();
  
  const handleClick = () => {
    trackUserInteraction('button_click', {
      component: 'MyComponent',
      value: 'important_action'
    });
  };
  
  useEffect(() => {
    trackEvent('page_view', { 
      page: 'dashboard',
      timestamp: Date.now()
    });
  }, []);
}
```

## 🛠️ **Development Commands:**

```bash
# Basic development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build

# Performance analysis
npm run analyze          # Bundle size analysis
npm run perf            # Build + performance analysis
npm run lighthouse      # Lighthouse audit

# PWA features  
npm run build:pwa       # Build with PWA validation
```

## 🎨 **Customization:**

### **Theme Colors:**
```css
/* Add custom theme in ThemeContext.jsx */
const customTheme = {
  name: 'Custom',
  colors: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    accent: '#45b7d1',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#2c3e50'
  }
};
```

### **Performance Settings:**
```js
// Adjust performance monitoring in performance.js
const performanceConfig = {
  enableCoreWebVitals: true,
  enableMemoryMonitoring: true,
  enableResourceTracking: true,
  sampleRate: 0.1 // 10% of users
};
```

## 🔥 **Pro Tips:**

1. **🎯 Bundle Analysis**: Run `npm run analyze` to see what's making your bundle large
2. **♿ Accessibility**: Press `Alt + A` anywhere to open accessibility settings
3. **📱 PWA**: Look for install prompt in browser address bar
4. **⚡ Performance**: Check DevTools → Application → Service Workers for PWA status
5. **🎨 Themes**: Combine theme switching with custom accent colors for unique looks
6. **📊 Analytics**: Check localStorage 'perf_events' for detailed performance data

## 🐛 **Troubleshooting:**

- **Import Errors**: Make sure you're importing the components that exist
- **Performance Issues**: Use React.memo() for expensive components
- **PWA Not Working**: Check if service worker is registered in DevTools
- **Animations Lag**: Enable "Reduce Motion" in accessibility settings
- **Bundle Too Large**: Run bundle analysis and remove unused dependencies

---

**🎉 Your website now has professional-grade features! Start with the basic features and gradually add the advanced ones as needed.**