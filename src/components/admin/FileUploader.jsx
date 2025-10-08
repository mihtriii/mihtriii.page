import React, { useState, useRef } from 'react';
import { Upload, File, X, Check, AlertCircle, Plus } from 'lucide-react';

const FileUploader = ({ onUploadComplete, maxFiles = 5, maxFileSize = 50 * 1024 * 1024 }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Form data for presentation metadata
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    date_presented: '',
    category: 'general',
    tags: '',
    is_public: true,
  });

  const allowedTypes = [
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'application/zip',
  ];

  const validateFile = (file) => {
    if (file.size > maxFileSize) {
      return `File ${file.name} is too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB`;
    }

    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed`;
    }

    return null;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    setError('');

    if (files.length + newFiles.length > maxFiles) {
      setError(`Cannot upload more than ${maxFiles} files`);
      return;
    }

    const validFiles = [];
    const errors = [];

    newFiles.forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(validationError);
      } else {
        validFiles.push({
          id: Date.now() + Math.random(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'ready',
        });
      }
    });

    if (errors.length > 0) {
      setError(errors.join(', '));
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    if (!formData.title || !formData.author) {
      setError('Title and author are required');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      const uploadFormData = new FormData();

      // Add files
      files.forEach((fileItem) => {
        uploadFormData.append('files', fileItem.file);
      });

      // Add metadata
      Object.keys(formData).forEach((key) => {
        uploadFormData.append(key, formData[key]);
      });

      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();

      setUploadProgress(100);

      // Reset form
      setFiles([]);
      setFormData({
        title: '',
        description: '',
        author: '',
        date_presented: '',
        category: 'general',
        tags: '',
        is_public: true,
      });

      if (onUploadComplete) {
        onUploadComplete(result.data);
      }

      // Show success message briefly
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Presentation</h2>

      {/* Form for metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter presentation title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter author name"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter presentation description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">General</option>
            <option value="research">Research</option>
            <option value="tutorial">Tutorial</option>
            <option value="quantum">Quantum Computing</option>
            <option value="ai">Artificial Intelligence</option>
            <option value="data-science">Data Science</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Presented</label>
          <input
            type="date"
            name="date_presented"
            value={formData.date_presented}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="quantum, physics, research"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_public"
            id="is_public"
            checked={formData.is_public}
            onChange={handleFormChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
            Make public
          </label>
        </div>
      </div>

      {/* File upload area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium text-gray-700">Drop files here or click to browse</p>
            <p className="text-sm text-gray-500">
              Maximum {maxFiles} files, up to {maxFileSize / (1024 * 1024)}MB each
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supported: PDF, PowerPoint, Images, ZIP, Text files
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Select Files
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept={allowedTypes.join(',')}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Selected Files</h3>
          <div className="space-y-2">
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <File className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{fileItem.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(fileItem.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(fileItem.id)}
                  className="p-1 text-red-500 hover:text-red-700"
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700">Uploading...</span>
            <span className="text-sm text-gray-700">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md ${
            uploading || files.length === 0
              ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
              : 'text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Upload Presentation
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;
