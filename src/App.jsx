import React, { Suspense, useEffect } from 'react';
import { AnimationProvider } from './components/ThemeToggle.jsx';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
const CV = React.lazy(() => import('./pages/CV.jsx'));
const Blog = React.lazy(() => import('./pages/Blog.jsx'));
const Repos = React.lazy(() => import('./pages/Repos.jsx'));
const BlogPost = React.lazy(() => import('./pages/BlogPost.jsx'));
import { WithPresence, PageWrapper } from './components/PageTransition.jsx';
import { useI18n } from './i18n/index.jsx';

export default function App() {
  const { t } = useI18n();
  const location = useLocation();

  // Robust scroll-reveal for elements with [data-animate]
  useEffect(() => {
    const supportsIO = 'IntersectionObserver' in window;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // If user prefers reduced motion, reveal everything immediately
    if (!supportsIO || reduceMotion) {
      document.querySelectorAll('[data-animate]').forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    );

    const observeAll = () => {
      const els = document.querySelectorAll('[data-animate]:not(.is-visible)');
      els.forEach((el) => io.observe(el));
    };

    // Observe initially and after a short delay (for transitions/mounts)
    const t1 = setTimeout(observeAll, 0);
    const t2 = setTimeout(observeAll, 250);
    const t3 = setTimeout(observeAll, 800);

    // MutationObserver to catch dynamically added nodes (e.g., fetched lists, MDX)
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((n) => {
          if (n.nodeType === 1) {
            if (n.matches && n.matches('[data-animate]:not(.is-visible)')) io.observe(n);
            n.querySelectorAll &&
              n.querySelectorAll('[data-animate]:not(.is-visible)').forEach((el) => io.observe(el));
          }
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Safety: ensure nothing stays hidden after 2s
    const safety = setTimeout(() => {
      document
        .querySelectorAll('[data-animate]:not(.is-visible)')
        .forEach((el) => el.classList.add('is-visible'));
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(safety);
      mo.disconnect();
      io.disconnect();
    };
  }, [location.pathname]);

  return (
    <AnimationProvider>
      <div className="app">
        <Header />
        <main className="container py-4">
          <WithPresence location={location}>
            <Suspense
              fallback={
                <div className="text-center text-secondary py-5" aria-busy="true">
                  {t('common.loading')}
                </div>
              }
            >
              <Routes location={location}>
                <Route
                  path="/"
                  element={
                    <PageWrapper>
                      <Home />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/blog"
                  element={
                    <PageWrapper>
                      <Blog />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/blog/:slug"
                  element={
                    <PageWrapper>
                      <BlogPost />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/cv"
                  element={
                    <PageWrapper>
                      <CV />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/repos"
                  element={
                    <PageWrapper>
                      <Repos />
                    </PageWrapper>
                  }
                />
                <Route
                  path="*"
                  element={
                    <PageWrapper>
                      <Home />
                    </PageWrapper>
                  }
                />
              </Routes>
            </Suspense>
          </WithPresence>
        </main>
        <Footer />
      </div>
    </AnimationProvider>
  );
}
