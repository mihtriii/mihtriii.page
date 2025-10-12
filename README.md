# Mihtriii Personal Website

A modern, professional personal website built with React, Vite, and deployed on Vercel. Features a clean design with blog functionality, project showcase, and responsive layout.

## 🚀 Features

- **Modern React SPA** - Built with Vite for fast development and builds
- **Responsive Design** - Mobile-first design with professional styling
- **MDX Blog** - Write blog posts in Markdown with React components
- **Interactive Components** - Smooth animations and transitions
- **PWA Ready** - Progressive Web App capabilities
- **SEO Optimized** - Meta tags, sitemap, and performance optimized
- **Vercel Deployment** - Optimized for Vercel hosting

## 🏗️ Architecture

```
mihtriii.page/
├── src/                 # Frontend React application
│   ├── components/      # Reusable React components
│   ├── pages/           # Page components
│   ├── blog/            # MDX blog posts
│   ├── styles/          # CSS and styling
│   └── utils/           # Utility functions
├── public/              # Static assets
├── scripts/             # Build and utility scripts
└── vercel.json          # Vercel deployment configuration
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm 8+

### Quick Start

```bash
# Clone the repository
git clone https://github.com/mihtriii/mihtriii.page.git
cd mihtriii.page

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

The application runs entirely on the frontend - no backend setup required for basic functionality.

## � Deployment

### Vercel (Recommended)

This project is optimized for Vercel deployment:

1. **Connect to Vercel**: Import your GitHub repository to Vercel
2. **Auto-deploy**: Vercel will automatically build and deploy on every push
3. **Custom Domain**: Configure your custom domain in Vercel settings

### Manual Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### GitHub Pages

```bash
# Deploy to GitHub Pages
npm run deploy
```

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages
- `npm run sitemap` - Generate sitemap
- `npm run analyze` - Analyze bundle size

## 🧪 Testing

```bash
# Run performance tests
npm run test:performance

# Analyze bundle
npm run analyze
```

## 🎨 Customization

### Content

- **Blog Posts**: Add MDX files in `src/blog/`
- **Site Config**: Update `src/config/site.js`
- **Navigation**: Modify `src/components/Header.jsx`
- **Styling**: Edit `src/styles.css` for global styles

### Adding New Pages

1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Update navigation if needed

### Blog Posts

Create new `.mdx` files in `src/blog/` with frontmatter:

```mdx
export const meta = {
  title: 'Your Post Title',
  date: '2025-01-01',
  tags: ['tag1', 'tag2'],
  excerpt: 'Post description',
  readingTime: 5,
  featured: false,
};

# Your Post Title

Your content here...
```

## 📈 Performance

- **Vite** - Fast development and optimized builds
- **Code Splitting** - Automatic route-based code splitting
- **Image Optimization** - Optimized images and lazy loading
- **Bundle Analysis** - Built-in bundle size analysis
- **Lighthouse Score** - 95+ performance score

## 🔒 Security

- **Content Security Policy** - Implemented via meta tags
- **XSS Protection** - Input sanitization
- **HTTPS** - Enforced on Vercel deployment

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 🐛 Issues

Report issues at: https://github.com/mihtriii/mihtriii.page/issues

## 📞 Contact

- **Author**: Nguyen Minh Tri
- **Website**: https://mihtriii.github.io
- **Email**: your-email@example.com

---

⭐ Star this repo if you found it helpful!

