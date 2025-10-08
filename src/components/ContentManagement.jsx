import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Rich text editor for blog posts
 */
export function BlogEditor({ initialContent = '', onSave, onCancel, className = '' }) {
  const [content, setContent] = useState(initialContent);
  const [metadata, setMetadata] = useState({
    title: '',
    excerpt: '',
    tags: [],
    readTime: 0,
    status: 'draft', // draft, published, scheduled
  });
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef(null);

  // Calculate read time based on content length
  useEffect(() => {
    const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length;
    const readTime = Math.ceil(wordCount / 200); // Average reading speed
    setMetadata((prev) => ({ ...prev, readTime }));
  }, [content]);

  // Rich text formatting functions
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      formatText('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      formatText('insertImage', url);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        content,
        metadata: {
          ...metadata,
          updatedAt: new Date().toISOString(),
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = (tag) => {
    if (tag && !metadata.tags.includes(tag)) {
      setMetadata((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setMetadata((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <div className={`blog-editor ${className}`}>
      {/* Editor Header */}
      <div className="editor-header border-bottom p-3 bg-light">
        <div className="row align-items-center">
          <div className="col">
            <h4 className="mb-0">Blog Editor</h4>
          </div>
          <div className="col-auto">
            <div className="btn-group" role="group">
              <button
                className={`btn btn-sm ${!isPreview ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setIsPreview(false)}
              >
                <i className="bi bi-pencil me-1"></i>
                Edit
              </button>
              <button
                className={`btn btn-sm ${isPreview ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setIsPreview(true)}
              >
                <i className="bi bi-eye me-1"></i>
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-0">
        {/* Sidebar - Metadata */}
        <div className="col-lg-3 border-end bg-light">
          <div className="p-3">
            <h6 className="fw-semibold mb-3">Post Settings</h6>

            {/* Title */}
            <div className="mb-3">
              <label className="form-label small">Title</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={metadata.title}
                onChange={(e) => setMetadata((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter post title..."
              />
            </div>

            {/* Excerpt */}
            <div className="mb-3">
              <label className="form-label small">Excerpt</label>
              <textarea
                className="form-control form-control-sm"
                rows="3"
                value={metadata.excerpt}
                onChange={(e) => setMetadata((prev) => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief description..."
              />
            </div>

            {/* Tags */}
            <div className="mb-3">
              <label className="form-label small">Tags</label>
              <div className="input-group input-group-sm mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add tag..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addTag(e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={(e) => {
                    const input = e.target.parentElement.querySelector('input');
                    addTag(input.value.trim());
                    input.value = '';
                  }}
                >
                  Add
                </button>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {metadata.tags.map((tag) => (
                  <span key={tag} className="badge bg-secondary">
                    {tag}
                    <button
                      className="btn-close btn-close-white ms-1"
                      style={{ fontSize: '0.5rem' }}
                      onClick={() => removeTag(tag)}
                    ></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="mb-3">
              <label className="form-label small">Status</label>
              <select
                className="form-select form-select-sm"
                value={metadata.status}
                onChange={(e) => setMetadata((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            {/* Stats */}
            <div className="mb-3">
              <small className="text-muted">
                <div>Read time: ~{metadata.readTime} min</div>
                <div>Words: {content.split(/\s+/).filter((w) => w.length > 0).length}</div>
              </small>
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="col-lg-9">
          {!isPreview ? (
            <>
              {/* Toolbar */}
              <div className="editor-toolbar border-bottom p-2">
                <div className="btn-toolbar" role="toolbar">
                  <div className="btn-group btn-group-sm me-2" role="group">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => formatText('bold')}
                      title="Bold"
                    >
                      <i className="bi bi-type-bold"></i>
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => formatText('italic')}
                      title="Italic"
                    >
                      <i className="bi bi-type-italic"></i>
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => formatText('underline')}
                      title="Underline"
                    >
                      <i className="bi bi-type-underline"></i>
                    </button>
                  </div>

                  <div className="btn-group btn-group-sm me-2" role="group">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => formatText('justifyLeft')}
                      title="Align Left"
                    >
                      <i className="bi bi-text-left"></i>
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => formatText('justifyCenter')}
                      title="Align Center"
                    >
                      <i className="bi bi-text-center"></i>
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => formatText('justifyRight')}
                      title="Align Right"
                    >
                      <i className="bi bi-text-right"></i>
                    </button>
                  </div>

                  <div className="btn-group btn-group-sm me-2" role="group">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => formatText('insertUnorderedList')}
                      title="Bullet List"
                    >
                      <i className="bi bi-list-ul"></i>
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => formatText('insertOrderedList')}
                      title="Numbered List"
                    >
                      <i className="bi bi-list-ol"></i>
                    </button>
                  </div>

                  <div className="btn-group btn-group-sm" role="group">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={insertLink}
                      title="Insert Link"
                    >
                      <i className="bi bi-link-45deg"></i>
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={insertImage}
                      title="Insert Image"
                    >
                      <i className="bi bi-image"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Editor Content */}
              <div
                ref={editorRef}
                className="editor-content p-3"
                contentEditable
                style={{
                  minHeight: '400px',
                  outline: 'none',
                  lineHeight: '1.6',
                }}
                dangerouslySetInnerHTML={{ __html: content }}
                onInput={(e) => setContent(e.target.innerHTML)}
                onPaste={(e) => {
                  e.preventDefault();
                  const text = e.clipboardData.getData('text/plain');
                  document.execCommand('insertText', false, text);
                }}
              />
            </>
          ) : (
            /* Preview */
            <div className="editor-preview p-3">
              <h1>{metadata.title || 'Untitled Post'}</h1>
              {metadata.excerpt && <p className="lead text-muted">{metadata.excerpt}</p>}
              <div className="mb-3">
                <small className="text-muted">Reading time: {metadata.readTime} minutes</small>
                {metadata.tags.length > 0 && (
                  <div className="mt-2">
                    {metadata.tags.map((tag) => (
                      <span key={tag} className="badge bg-primary me-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <hr />
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: content }}
                style={{ lineHeight: '1.6' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="editor-footer border-top p-3 bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">Last saved: {new Date().toLocaleTimeString()}</small>
          <div className="btn-group">
            <button className="btn btn-outline-secondary" onClick={onCancel} disabled={isSaving}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isSaving || !metadata.title.trim()}
            >
              {isSaving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" />
                  Saving...
                </>
              ) : (
                'Save Post'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Image upload component with optimization
 */
export function ImageUploader({
  onUpload,
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = '',
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (files) => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload an image.');
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      alert(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB.`);
      return;
    }

    setUploading(true);
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);

      // Optimize image
      const optimizedFile = await optimizeImage(file);

      // Upload
      await onUpload(optimizedFile);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const optimizeImage = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1200px width)
        const maxWidth = 1200;
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/webp', 0.8);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className={`image-uploader ${className}`}>
      <div
        className={`upload-zone border border-2 border-dashed rounded p-4 text-center ${
          isDragging ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        style={{ cursor: 'pointer' }}
      >
        {uploading ? (
          <div>
            <div className="spinner-border text-primary mb-2" />
            <p className="mb-0">Uploading...</p>
          </div>
        ) : preview ? (
          <div>
            <img
              src={preview}
              alt="Preview"
              className="img-thumbnail mb-2"
              style={{ maxHeight: '200px' }}
            />
            <p className="mb-0 small text-muted">Click to change image</p>
          </div>
        ) : (
          <div>
            <i className="bi bi-cloud-upload fs-1 text-muted d-block mb-2"></i>
            <p className="mb-1">
              Drop image here or <span className="text-primary">click to browse</span>
            </p>
            <small className="text-muted">
              Supports JPEG, PNG, WebP up to {maxSize / 1024 / 1024}MB
            </small>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="d-none"
      />
    </div>
  );
}

export default BlogEditor;
