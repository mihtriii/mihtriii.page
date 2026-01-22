import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar.jsx';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/index.jsx';
import { useMagnetic } from '../hooks/useMagnetic.js';

const modules = import.meta.glob('../blog/*.mdx', { eager: true });

// Helper function to calculate reading time
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

function BlogPostCard({ post }) {
  const magneticRef = useMagnetic(0.08); // Subtle magnetic effect for blog grid

  return (
    <div
      ref={magneticRef}
      className="card card-hover card-elevate h-100 text-decoration-none magnetic"
    >
      <Link className="text-decoration-none h-100 d-flex flex-column" to={`/blog/${post.slug}`}>
        <div className="card-body d-flex flex-column h-100">
          <div className="d-flex justify-content-between align-items-baseline mb-2">
            <h2 className="h6 mb-0 fw-semibold group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            {post.date && <span className="text-secondary small">{post.date}</span>}
          </div>

          {post.summary && <p className="mb-3 text-secondary small flex-grow-1">{post.summary}</p>}

          {/* Tags and Reading Time */}
          <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-light-subtle">
            <div className="d-flex flex-wrap gap-1">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="badge text-bg-secondary bg-opacity-10 text-body"
                  style={{ fontSize: '0.7rem' }}
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 2 && (
                <span
                  className="badge text-bg-light text-secondary"
                  style={{ fontSize: '0.7rem' }}
                >
                  +{post.tags.length - 2}
                </span>
              )}
            </div>
            <span className="text-secondary small d-flex align-items-center gap-1">
              <i className="bi bi-clock"></i>
              {post.readingTime} min
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function Blog() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState('date'); // date, title, readingTime

  const posts = useMemo(() => {
    return Object.entries(modules)
      .map(([path, mod]) => {
        const slug = path
          .split('/')
          .pop()
          .replace(/\.mdx$/, '');
        const meta = mod.meta || {};
        const content = mod.default?.toString() || '';
        const readingTime = meta.readingTime || calculateReadingTime(content);

        return {
          slug,
          title: meta.title || slug,
          date: meta.date || '',
          summary: meta.summary || '',
          tags: meta.tags || [],
          readingTime,
        };
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'readingTime':
            return a.readingTime - b.readingTime;
          case 'date':
          default:
            return (b.date || '').localeCompare(a.date || '');
        }
      });
  }, [sortBy]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set();
    posts.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag));
    });
    return ['All', ...Array.from(tags).sort()];
  }, [posts]);

  // Filter posts based on search and tag
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  return (
    <div className="row g-4">
      <aside className="col-12 col-lg-3">
        <Sidebar />
      </aside>
      <div className="col-12 col-lg-9">
        <section className="page-hero hero-with-bg p-4 mb-3" data-animate>
          <h1 className="h3 mb-1">
            <span className="gradient-text">{t('blog.title')}</span>
          </h1>
          <p className="text-secondary mb-0">{t('blog.subtitle')}</p>
        </section>

        {/* Search and Filter Controls */}
        <div className="card card-elevate mb-4" data-animate>
          <div className="card-body">
            <div className="row g-3">
            {/* Search Input */}
              <div className="col-12 col-md-6">
                <div className="position-relative">
                  <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary z-1"></i>
                  <input
                    type="text"
                    className="form-control ps-5 search-input-glow"
                    placeholder={t('common.search') + ' posts...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div className="col-12 col-md-3">
                <select
                  className="form-select border-light-subtle"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="readingTime">Sort by Reading Time</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="col-12 col-md-3">
                <div className="d-flex align-items-center h-100 justify-content-end">
                  <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3">
                    {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tag Filter - Staggered Animation */}
            <div className="mt-4 pt-3 border-top border-light-subtle">
              <span className="small text-secondary me-2 text-uppercase fw-semibold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Filter by Tag:</span>
              <motion.div 
                className="d-flex flex-wrap gap-2 mt-2"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.03 } }
                }}
              >
                {allTags.map((tag) => (
                  <motion.button
                    key={tag}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1 }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`btn btn-sm ${
                      selectedTag === tag 
                        ? 'btn-primary shadow-sm' 
                        : 'btn-outline-secondary border-0 bg-secondary-subtle'
                    }`}
                    onClick={() => setSelectedTag(tag)}
                    style={{ fontSize: '0.85rem' }}
                  >
                    {tag}
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <AnimatePresence mode="wait">
          {filteredPosts.length === 0 ? (
            <motion.div
              key="no-posts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-5"
            >
              <i className="bi bi-search text-secondary" style={{ fontSize: '3rem' }}></i>
              <h3 className="h5 mt-3 text-secondary">No posts found</h3>
              <p className="text-secondary">Try adjusting your search or filter criteria.</p>
            </motion.div>
          ) : (
            <motion.div key="posts-grid" layout className="row g-3 row-cols-1 row-cols-md-2">
              <AnimatePresence>
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.slug}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="col"
                    whileHover={{ y: -5 }}
                  >
                    <BlogPostCard post={post} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
