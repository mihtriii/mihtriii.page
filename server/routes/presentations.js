import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { presentationQueries, fileQueries, analyticsQueries } from '../database/sqlite.js';

const router = express.Router();

// Get all presentations
router.get('/', async (req, res) => {
  try {
    const {
      category,
      author,
      search,
      limit,
      page = 1,
      sort = 'date_created',
      order = 'desc'
    } = req.query;

    const filters = {
      category,
      author,
      search,
      limit: limit ? parseInt(limit) : undefined
    };

    const presentations = await presentationQueries.getAll(filters);

    // Add file URLs and clean up paths
    const enrichedPresentations = presentations.map(presentation => ({
      ...presentation,
      thumbnail: presentation.thumbnail_path 
        ? `/api/thumbnails/${path.basename(presentation.thumbnail_path)}`
        : null,
      download_url: `/api/presentations/${presentation.id}/download`,
      view_url: `/api/presentations/${presentation.id}`,
      // Remove sensitive server paths
      file_path: undefined,
      thumbnail_path: undefined
    }));

    res.json({
      success: true,
      data: enrichedPresentations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit) || enrichedPresentations.length,
        total: enrichedPresentations.length
      }
    });

  } catch (error) {
    console.error('Error fetching presentations:', error);
    res.status(500).json({
      error: 'Failed to fetch presentations',
      message: 'An error occurred while retrieving presentations'
    });
  }
});

// Get presentation by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const presentation = await presentationQueries.getById(id);

    if (!presentation) {
      return res.status(404).json({
        error: 'Presentation not found',
        message: 'The requested presentation does not exist'
      });
    }

    // Get associated files
    const files = await fileQueries.getByPresentationId(id);

    // Increment view count
    await presentationQueries.incrementViewCount(id);

    // Record analytics
    await analyticsQueries.recordEvent({
      presentation_id: id,
      event_type: 'view',
      user_agent: req.get('User-Agent'),
      ip_address: req.ip,
      metadata: {}
    });

    // Enrich response data
    const enrichedPresentation = {
      ...presentation,
      thumbnail: presentation.thumbnail_path 
        ? `/api/thumbnails/${path.basename(presentation.thumbnail_path)}`
        : null,
      files: files.map(file => ({
        ...file,
        download_url: `/api/files/${file.id}/download`,
        // Remove sensitive server paths
        file_path: undefined
      })),
      // Remove sensitive server paths
      file_path: undefined,
      thumbnail_path: undefined
    };

    res.json({
      success: true,
      data: enrichedPresentation
    });

  } catch (error) {
    console.error('Error fetching presentation:', error);
    res.status(500).json({
      error: 'Failed to fetch presentation',
      message: 'An error occurred while retrieving the presentation'
    });
  }
});

// Download presentation primary file
router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    const presentation = await presentationQueries.getById(id);

    if (!presentation) {
      return res.status(404).json({
        error: 'Presentation not found',
        message: 'The requested presentation does not exist'
      });
    }

    // Check if file exists
    try {
      await fs.access(presentation.file_path);
    } catch {
      return res.status(404).json({
        error: 'File not found',
        message: 'The presentation file is no longer available'
      });
    }

    // Increment download count
    await presentationQueries.incrementDownloadCount(id);

    // Record analytics
    await analyticsQueries.recordEvent({
      presentation_id: id,
      event_type: 'download',
      user_agent: req.get('User-Agent'),
      ip_address: req.ip,
      metadata: {
        file_type: presentation.file_type,
        file_size: presentation.file_size
      }
    });

    // Set appropriate headers
    const filename = `${presentation.title}${presentation.file_type}`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Send file
    res.sendFile(path.resolve(presentation.file_path));

  } catch (error) {
    console.error('Error downloading presentation:', error);
    res.status(500).json({
      error: 'Download failed',
      message: 'An error occurred while downloading the file'
    });
  }
});

// Update presentation
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate that presentation exists
    const existing = await presentationQueries.getById(id);
    if (!existing) {
      return res.status(404).json({
        error: 'Presentation not found',
        message: 'The requested presentation does not exist'
      });
    }

    // Filter allowed update fields
    const allowedFields = [
      'title', 'description', 'author', 'date_presented', 
      'category', 'tags', 'is_public'
    ];
    
    const filteredUpdates = {};
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({
        error: 'No valid fields to update',
        message: 'Please provide at least one valid field to update'
      });
    }

    await presentationQueries.update(id, filteredUpdates);

    // Get updated presentation
    const updated = await presentationQueries.getById(id);

    res.json({
      success: true,
      message: 'Presentation updated successfully',
      data: {
        ...updated,
        thumbnail: updated.thumbnail_path 
          ? `/api/thumbnails/${path.basename(updated.thumbnail_path)}`
          : null,
        // Remove sensitive server paths
        file_path: undefined,
        thumbnail_path: undefined
      }
    });

  } catch (error) {
    console.error('Error updating presentation:', error);
    res.status(500).json({
      error: 'Update failed',
      message: 'An error occurred while updating the presentation'
    });
  }
});

// Delete presentation
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get presentation and associated files
    const presentation = await presentationQueries.getById(id);
    if (!presentation) {
      return res.status(404).json({
        error: 'Presentation not found',
        message: 'The requested presentation does not exist'
      });
    }

    const files = await fileQueries.getByPresentationId(id);

    // Delete physical files
    const filesToDelete = [
      presentation.file_path,
      ...(presentation.thumbnail_path ? [path.resolve(presentation.thumbnail_path)] : []),
      ...files.map(file => file.file_path)
    ];

    for (const filePath of filesToDelete) {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.warn(`Could not delete file ${filePath}:`, error.message);
      }
    }

    // Delete from database (cascades to files and comments)
    await presentationQueries.delete(id);

    res.json({
      success: true,
      message: 'Presentation deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting presentation:', error);
    res.status(500).json({
      error: 'Delete failed',
      message: 'An error occurred while deleting the presentation'
    });
  }
});

// Get presentation analytics
router.get('/:id/analytics', async (req, res) => {
  try {
    const { id } = req.params;
    const { timeframe = '30d' } = req.query;

    // Validate that presentation exists
    const presentation = await presentationQueries.getById(id);
    if (!presentation) {
      return res.status(404).json({
        error: 'Presentation not found',
        message: 'The requested presentation does not exist'
      });
    }

    const stats = await analyticsQueries.getStats(id, timeframe);

    // Aggregate stats by event type
    const aggregated = stats.reduce((acc, stat) => {
      if (!acc[stat.event_type]) {
        acc[stat.event_type] = {
          total: 0,
          daily: []
        };
      }
      acc[stat.event_type].total += stat.count;
      acc[stat.event_type].daily.push({
        date: stat.date,
        count: stat.count
      });
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        presentation_id: id,
        timeframe,
        stats: aggregated,
        summary: {
          total_views: presentation.view_count,
          total_downloads: presentation.download_count
        }
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: 'An error occurred while retrieving analytics data'
    });
  }
});

// Search presentations
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 20, category } = req.query;

    const presentations = await presentationQueries.getAll({
      search: query,
      category,
      limit: parseInt(limit)
    });

    // Record search analytics
    await analyticsQueries.recordEvent({
      presentation_id: null,
      event_type: 'search',
      user_agent: req.get('User-Agent'),
      ip_address: req.ip,
      metadata: {
        query,
        results_count: presentations.length,
        category
      }
    });

    const enrichedPresentations = presentations.map(presentation => ({
      ...presentation,
      thumbnail: presentation.thumbnail_path 
        ? `/api/thumbnails/${path.basename(presentation.thumbnail_path)}`
        : null,
      // Remove sensitive server paths
      file_path: undefined,
      thumbnail_path: undefined
    }));

    res.json({
      success: true,
      data: enrichedPresentations,
      query,
      total_results: presentations.length
    });

  } catch (error) {
    console.error('Error searching presentations:', error);
    res.status(500).json({
      error: 'Search failed',
      message: 'An error occurred while searching presentations'
    });
  }
});

export default router;