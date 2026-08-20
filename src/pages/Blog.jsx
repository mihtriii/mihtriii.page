import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar.jsx';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/index.jsx';
import { useMagnetic } from '../hooks/useMagnetic.js';
import { blogPosts } from '../blog/manifest.js';

function BlogPostCard({ post }) {
  const magneticRef = useMagnetic(0.06);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -6 }}
      className="h-100"
    >
      <div
        ref={magneticRef}
        className="roman-card beam-border h-100 p-4"
      >
        <Link className="text-decoration-none h-100 d-flex flex-column" to={`/blog/${post.slug}`}>
          <div className="d-flex justify-content-between align-items-baseline mb-2">
            <h2 className="h6 mb-0 fw-bold font-display text-primary">
              {post.title}
            </h2>
            {post.date && <span className="text-secondary small font-mono ms-2" style={{ fontSize: '0.72rem' }}>{post.date}</span>}
          </div>

          {post.summary && (
            <p className="mb-3 text-secondary small flex-grow-1" style={{ lineHeight: '1.6' }}>
              {post.summary}
            </p>
          )}

          {/* Tags and Reading Time */}
          <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-zinc">
            <div className="d-flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="roman-badge-gold"
                  style={{ fontSize: '0.68rem' }}
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span
                  className="roman-badge-gold"
                  style={{ fontSize: '0.68rem' }}
                >
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
            <span className="text-gold small d-flex align-items-center gap-1 font-mono" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-clock"></i>
              {post.readingTime ? `${post.readingTime} min` : 'Read'}
            </span>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

export default function Blog() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const posts = useMemo(() => {
    return [...blogPosts].sort((a, b) => {
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
        {/* Hero Section */}
        <section
          className="hero-section roman-card-elevated p-4 p-md-5 mb-4 position-relative overflow-hidden spotlight"
          id="main-content"
          data-animate
        >
          <div className="hero-ambient" aria-hidden="true" />
          
          <span className="roman-eyebrow d-block mb-3">Research Notes &amp; Writings</span>
          <h1 className="font-display fw-bold mb-2 hero-title text-gradient-gold">
            {t('blog.title')}
          </h1>
          <p className="text-secondary mb-0">{t('blog.subtitle')}</p>
        </section>

        {/* Search and Filter Controls */}
        <div className="roman-card beam-border mb-4" data-animate>
          <div className="roman-card-inner p-4">
            <div className="row g-3">
              {/* Search Input */}
              <div className="col-12 col-md-6">
                <div className="position-relative">
                  <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary z-1"></i>
                  <input
                    type="text"
                    className="input-roman ps-5"
                    placeholder={t('common.search') + ' posts...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div className="col-12 col-md-3">
                <select
                  className="input-roman"
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
                  <span className="roman-metric-pill">
                    <span className="roman-metric-label">Result</span>
                    <span className="roman-metric-value">{filteredPosts.length}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Tag Filter - Staggered Animation */}
            <div className="mt-4 pt-3 border-top border-zinc">
              <span className="roman-eyebrow me-2">Filter by Tag</span>
              <motion.div
                className="d-flex flex-wrap gap-2 mt-2"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.03 } },
                }}
              >
                {allTags.map((tag) => (
                  <motion.button
                    key={tag}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1 },
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`btn-roman ${selectedTag === tag ? 'btn-roman-primary' : 'btn-roman-ghost'} btn-sm`}
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