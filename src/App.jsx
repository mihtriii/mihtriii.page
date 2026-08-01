import React, { Suspense, useEffect } from 'react';
import { AnimationProvider } from './components/ThemeToggle.jsx';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CriticalImagePreload from './components/CriticalImagePreload.jsx';
import Home from './pages/Home.jsx';
const CV = React.lazy(() => import('./pages/CV.jsx'));
const Blog = React.lazy(() => import('./pages/Blog.jsx'));
const Repos = React.lazy(() => import('./pages/Repos.jsx'));
const BlogPost = React.lazy(() => import('./pages/BlogPost.jsx'));
const Moments = React.lazy(() => import('./pages/Moments.jsx'));
const News = React.lazy(() => import('./pages/News.jsx'));
const Publications = React.lazy(() => import('./pages/Publications.jsx'));
const AdminRoute = React.lazy(() => import('./routes/AdminRoute.jsx'));
import { WithPresence, PageWrapper } from './components/PageTransition.jsx';
import { useI18n } from './i18n/index.jsx';

export default function App() {
  const { t } = useI18n();
  const location = useLocation();

  // Scroll-triggered reveal for [data-animate] elements
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = document.querySelectorAll('[data-animate]:not(.is-visible)');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible', 'visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible', 'visible');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -5% 0px', threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));

    // Safety: force visible after 800ms (reduced from 2s)
    const safety = setTimeout(() => {
      document.querySelectorAll('[data-animate]:not(.is-visible)').forEach((el) => {
        el.classList.add('is-visible', 'visible');
      });
    }, 800);

    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, [location.pathname]);

  return (
    <AnimationProvider>
      <div className="app">
        <CriticalImagePreload />
        {location.pathname !== '/admin' && <Header />}
        <main className={location.pathname === '/admin' ? '' : 'container py-4'}>
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
                  path="/moments"
                  element={
                    <PageWrapper>
                      <Moments />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/news"
                  element={
                    <PageWrapper>
                      <News />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/publications"
                  element={
                    <PageWrapper>
                      <Publications />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <PageWrapper>
                      <AdminRoute />
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
        {location.pathname !== '/admin' && <Footer />}
      </div>
    </AnimationProvider>
  );
}
