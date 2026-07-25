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
const Moments = React.lazy(() => import('./pages/Moments.jsx'));
const News = React.lazy(() => import('./pages/News.jsx'));
const Publications = React.lazy(() => import('./pages/Publications.jsx'));
const AdminRoute = React.lazy(() => import('./routes/AdminRoute.jsx'));
import { WithPresence, PageWrapper } from './components/PageTransition.jsx';
import { useI18n } from './i18n/index.jsx';

export default function App() {
  const { t } = useI18n();
  const location = useLocation();

  // Simple reduced-motion respect for CSS [data-animate] elements
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      document.querySelectorAll('[data-animate]').forEach((el) => {
        el.classList.add('is-visible', 'visible');
      });
    }
  }, [location.pathname]);

  return (
    <AnimationProvider>
      <div className="app">
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
