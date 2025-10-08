import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Edit, Trash2, Calendar, User, Tag } from 'lucide-react';

const PresentationManager = () => {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('date_created');
  const [sortOrder, setSortOrder] = useState('desc');

  const categories = ['general', 'research', 'tutorial', 'quantum', 'ai', 'data-science', 'other'];

  useEffect(() => {
    fetchPresentations();
  }, [searchTerm, selectedCategory, sortBy, sortOrder]);

  const fetchPresentations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);

      const response = await fetch(`http://localhost:3001/api/presentations?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch presentations');
      }

      const data = await response.json();

      // Sort presentations
      const sorted = data.data.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (sortBy === 'date_created' || sortBy === 'date_presented') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        } else {
          return aValue > bValue ? 1 : -1;
        }
      });

      setPresentations(sorted);
    } catch (error) {
      console.error('Error fetching presentations:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/presentations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete presentation');
      }

      // Remove from local state
      setPresentations((prev) => prev.filter((p) => p.id !== id));

      // Show success message (you could use a toast library here)
      alert('Presentation deleted successfully');
    } catch (error) {
      console.error('Error deleting presentation:', error);
      alert('Failed to delete presentation: ' + error.message);
    }
  };

  const handleToggleVisibility = async (id, currentVisibility) => {
    try {
      const response = await fetch(`http://localhost:3001/api/presentations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_public: !currentVisibility,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update presentation');
      }

      // Update local state
      setPresentations((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_public: !currentVisibility } : p))
      );
    } catch (error) {
      console.error('Error updating presentation:', error);
      alert('Failed to update presentation: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Presentation Manager</h2>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search presentations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date_created-desc">Newest First</option>
              <option value="date_created-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="view_count-desc">Most Viewed</option>
              <option value="download_count-desc">Most Downloaded</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Presentations Grid */}
      {presentations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No presentations found</p>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presentations.map((presentation) => (
            <div
              key={presentation.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              <div className="h-48 bg-gray-200 relative">
                {presentation.thumbnail ? (
                  <img
                    src={`http://localhost:3001${presentation.thumbnail}`}
                    alt={presentation.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📄</div>
                    <div className="text-sm">{presentation.file_type?.toUpperCase()}</div>
                  </div>
                </div>

                {/* Status badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      presentation.is_public
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {presentation.is_public ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                  {presentation.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {presentation.description || 'No description available'}
                </p>

                {/* Metadata */}
                <div className="space-y-1 text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span>{presentation.author}</span>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(presentation.date_created)}</span>
                  </div>

                  <div className="flex items-center">
                    <Tag className="h-3 w-3 mr-1" />
                    <span className="capitalize">{presentation.category}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>{formatFileSize(presentation.file_size)}</span>
                    <span>{presentation.view_count || 0} views</span>
                  </div>
                </div>

                {/* Tags */}
                {presentation.tags && presentation.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {presentation.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {presentation.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          +{presentation.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        window.open(`http://localhost:3001${presentation.download_url}`, '_blank')
                      }
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() =>
                        window.open(
                          `http://localhost:3001/api/presentations/${presentation.id}`,
                          '_blank'
                        )
                      }
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleToggleVisibility(presentation.id, presentation.is_public)
                      }
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        presentation.is_public
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {presentation.is_public ? 'Make Private' : 'Make Public'}
                    </button>

                    <button
                      onClick={() => handleDelete(presentation.id, presentation.title)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PresentationManager;
