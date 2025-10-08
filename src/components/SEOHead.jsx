import { useEffect } from 'react';

const defaultMeta = {
  title: 'Nguyễn Minh Trí · AI Student · VLMs · QML',
  description:
    'AI student at FPTU HCM focusing on Computer Vision, Vision-Language Models, and Quantum ML. Personal portfolio and research blog.',
  image: '/assets/avatar.JPG',
  url: 'https://mihtriii.github.io',
  type: 'website',
  siteName: 'Nguyễn Minh Trí',
  locale: 'en_US',
  author: 'Nguyễn Minh Trí',
  keywords:
    'AI, Computer Vision, VLM, Quantum ML, FPTU, Machine Learning, Deep Learning, Research, Portfolio, Blog',
};

// Custom hook for managing SEO
export function useSEO({
  title,
  description,
  image,
  url,
  type = 'website',
  article = null,
  noindex = false,
}) {
  useEffect(() => {
    const meta = {
      title: title ? `${title} | ${defaultMeta.siteName}` : defaultMeta.title,
      description: description || defaultMeta.description,
      image: image ? `${defaultMeta.url}${image}` : `${defaultMeta.url}${defaultMeta.image}`,
      url: url ? `${defaultMeta.url}${url}` : defaultMeta.url,
      type: type,
    };

    // Update document title
    document.title = meta.title;

    // Helper function to update or create meta tag
    const updateMeta = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update basic meta tags
    updateMeta('description', meta.description);
    updateMeta('keywords', defaultMeta.keywords);
    updateMeta('author', defaultMeta.author);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = meta.url;

    // Robots meta
    if (noindex) {
      updateMeta('robots', 'noindex, nofollow');
    }

    // Open Graph tags
    updateMeta('og:type', meta.type, true);
    updateMeta('og:title', meta.title, true);
    updateMeta('og:description', meta.description, true);
    updateMeta('og:image', meta.image, true);
    updateMeta('og:url', meta.url, true);
    updateMeta('og:site_name', defaultMeta.siteName, true);
    updateMeta('og:locale', defaultMeta.locale, true);

    // Twitter tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', meta.title);
    updateMeta('twitter:description', meta.description);
    updateMeta('twitter:image', meta.image);
    updateMeta('twitter:creator', '@mihtriii');

    // Article specific tags
    if (article) {
      updateMeta('article:author', defaultMeta.author, true);
      updateMeta('article:published_time', article.date, true);

      if (article.lastModified) {
        updateMeta('article:modified_time', article.lastModified, true);
      }

      // Remove existing article tags
      document.querySelectorAll('meta[property^="article:tag"]').forEach((el) => el.remove());

      // Add new article tags
      if (article.tags) {
        article.tags.forEach((tag) => {
          updateMeta('article:tag', tag, true);
        });
      }
    }

    // Structured data
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'BlogPosting' : 'Person',
      ...(type === 'article'
        ? {
            headline: title,
            description: description,
            image: meta.image,
            author: {
              '@type': 'Person',
              name: defaultMeta.author,
            },
            publisher: {
              '@type': 'Person',
              name: defaultMeta.author,
            },
            datePublished: article?.date,
            dateModified: article?.lastModified || article?.date,
            url: meta.url,
          }
        : {
            name: defaultMeta.author,
            url: defaultMeta.url,
            image: meta.image,
            description: defaultMeta.description,
            sameAs: [
              'https://github.com/mihtriii',
              'https://www.linkedin.com/in/mihtriii/',
              'https://www.kaggle.com/mihtriii',
            ],
            jobTitle: 'AI Student',
            affiliation: {
              '@type': 'Organization',
              name: 'FPT University Ho Chi Minh',
            },
            knowsAbout: [
              'Computer Vision',
              'Vision-Language Models',
              'Quantum Machine Learning',
              'Deep Learning',
            ],
          }),
    };

    // Update structured data
    let structuredDataScript = document.querySelector('script[type="application/ld+json"]');
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData, null, 2);
  }, [title, description, image, url, type, article, noindex]);
}

// Component wrapper for easier usage
export default function SEOHead(props) {
  useSEO(props);
  return null;
}
