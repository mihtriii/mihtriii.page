import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext.jsx';

export default function ThemeCustomizer() {
  const {
    themeMode,
    colorTheme,
    customAccent,
    colorThemes,
    toggleTheme,
    setColorTheme,
    setCustomAccent,
    currentTheme,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempColor, setTempColor] = useState(customAccent || currentTheme.accent);

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return 'bi-sun';
      case 'dark':
        return 'bi-moon-stars';
      case 'auto':
        return 'bi-circle-half';
      default:
        return 'bi-circle-half';
    }
  };

  const handleColorChange = (color) => {
    setTempColor(color);
    setCustomAccent(color);
  };

  const resetToThemeDefault = () => {
    setCustomAccent(null);
    setTempColor(currentTheme.accent);
    setShowColorPicker(false);
  };

  return (
    <>
      {/* Floating Theme Button */}
      <motion.button
        className="btn btn-primary position-fixed theme-customizer-trigger"
        style={{
          bottom: '100px',
          right: '20px',
          zIndex: 1045,
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        }}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Customize theme"
      >
        <i className="bi bi-palette2"></i>
      </motion.button>

      {/* Theme Customizer Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
              style={{ zIndex: 1050 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="position-fixed top-50 start-50 translate-middle bg-body rounded shadow-lg"
              style={{
                zIndex: 1051,
                width: '90vw',
                maxWidth: '400px',
                maxHeight: '80vh',
                overflow: 'hidden',
              }}
              initial={{ opacity: 0, scale: 0.9, y: '-50%', x: '-50%' }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', duration: 0.3 }}
            >
              <div className="p-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">
                    <i className="bi bi-palette2 me-2"></i>
                    Theme Customizer
                  </h5>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                {/* Theme Mode */}
                <div className="mb-4">
                  <h6 className="mb-3">
                    <i className="bi bi-brightness-high me-2"></i>
                    Theme Mode
                  </h6>
                  <button
                    className="btn btn-outline-primary d-flex align-items-center gap-2 w-100"
                    onClick={toggleTheme}
                  >
                    <i className={`bi ${getThemeIcon()}`}></i>
                    <span className="flex-grow-1 text-start">
                      {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
                    </span>
                    <small className="text-secondary">Click to change</small>
                  </button>
                </div>

                {/* Color Themes */}
                <div className="mb-4">
                  <h6 className="mb-3">
                    <i className="bi bi-palette me-2"></i>
                    Color Theme
                  </h6>
                  <div className="row g-2">
                    {Object.entries(colorThemes).map(([key, theme]) => (
                      <div key={key} className="col-6">
                        <motion.button
                          className={`btn w-100 text-start p-2 ${
                            colorTheme === key ? 'btn-primary' : 'btn-outline-secondary'
                          }`}
                          onClick={() => setColorTheme(key)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <div className="d-flex gap-1">
                              <div
                                className="rounded-circle"
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  backgroundColor: theme.primary,
                                }}
                              />
                              <div
                                className="rounded-circle"
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  backgroundColor: theme.secondary,
                                }}
                              />
                              <div
                                className="rounded-circle"
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  backgroundColor: theme.accent,
                                }}
                              />
                            </div>
                            <div className="flex-grow-1">
                              <div className="fw-medium" style={{ fontSize: '0.85rem' }}>
                                {theme.name}
                              </div>
                              <div className="text-secondary" style={{ fontSize: '0.7rem' }}>
                                {theme.description}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Accent Color */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">
                      <i className="bi bi-droplet me-2"></i>
                      Custom Accent
                    </h6>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    >
                      {showColorPicker ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showColorPicker && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="mb-3">
                          <input
                            type="color"
                            className="form-control form-control-color w-100"
                            value={tempColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                            style={{ height: '50px' }}
                          />
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary flex-grow-1"
                            onClick={resetToThemeDefault}
                          >
                            Reset to Default
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Preview */}
                <div className="border rounded p-3 bg-body-secondary">
                  <h6 className="mb-2">Preview</h6>
                  <div className="d-flex gap-2 mb-2">
                    <button className="btn btn-primary btn-sm">Primary</button>
                    <button className="btn btn-secondary btn-sm">Secondary</button>
                  </div>
                  <div className="d-flex gap-1">
                    <span className="badge text-bg-primary">Badge</span>
                    <span className="badge text-bg-secondary">Badge</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
