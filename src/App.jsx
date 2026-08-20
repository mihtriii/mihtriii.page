import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ToastContainer from './components/Toast.jsx';
import { useI18n } from './i18n/index.jsx';

// Pages (lazy loaded for code splitting)
const Home = React.lazy(() => import('./pages/Home.jsx'));
const Blog = React.lazy(() => import('./pages/Blog.jsx'));
const BlogPost = React.lazy(() => import('./pages/BlogPost.jsx'));
const CV = React.lazy(() => import('./pages/CV.jsx'));
const Repos = React.lazy(() => import('./pages/Repos.jsx'));
const Moments = React.lazy(() => import('./pages/Moments.jsx'));
const News = React.lazy(() => import('./pages/News.jsx'));
const Publications = React.lazy(() => import('./pages/Publications.jsx'));

// Intersection observer for data-animate elements (slide-up reveal)
function useRevealOnScroll(deps = []) {
  const location = useLocation();
  useEffect(() => {
    const els = document.querySelectorAll('[data-animate]:not(.is-visible)');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible', 'visible');
          }
        });
      },
      { rootMargin: '0px 0px -5% 0px', threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));

    const safety = setTimeout(() => {
      document.querySelectorAll('[data-animate]:not(.is-visible)').forEach((el) => {
        el.classList.add('is-visible', 'visible');
      });
    }, 800);

    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, [location.pathname, ...deps]);
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { t } = useI18n();
  const location = useLocation();
  useRevealOnScroll();

  return (
    <div className="app">
      <Header />
      <main className="container py-4">
        <ScrollToTop />
        <Suspense
          fallback={
            <div className="text-center text-secondary py-5" aria-busy="true">
              {t('common.loading')}
            </div>
          }
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/cv" element={<CV />} />
            <Route path="/repos" element={<Repos />} />
            <Route path="/moments" element={<Moments />} />
            <Route path="/news" element={<News />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}