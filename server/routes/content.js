import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { presentationQueries, analyticsQueries } from '../database/sqlite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Serve static files (thumbnails, downloads)
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Serve thumbnail images
router.get('/thumbnails/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const thumbnailPath = path.join(UPLOADS_DIR, 'thumbnails', filename);

    // Check if file exists
    try {
      await fs.access(thumbnailPath);
    } catch {
      return res.status(404).json({
        error: 'Thumbnail not found',
        message: 'The requested thumbnail does not exist'
      });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

    res.sendFile(path.resolve(thumbnailPath));

  } catch (error) {
    console.error('Error serving thumbnail:', error);
    res.status(500).json({
      error: 'Failed to serve thumbnail',
      message: 'An error occurred while serving the thumbnail'
    });
  }
});

// Get content statistics
router.get('/stats', async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    
    // Get overall statistics
    const allPresentations = await presentationQueries.getAll();
    const analytics = await analyticsQueries.getStats(null, timeframe);

    // Calculate statistics
    const stats = {
      total_presentations: allPresentations.length,
      total_views: allPresentations.reduce((sum, p) => sum + (p.view_count || 0), 0),
      total_downloads: allPresentations.reduce((sum, p) => sum + (p.download_count || 0), 0),
      categories: {},
      recent_activity: analytics.slice(0, 10),
      popular_presentations: allPresentations
        .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          title: p.title,
          author: p.author,
          view_count: p.view_count,
          download_count: p.download_count
        }))
    };

    // Group by categories
    allPresentations.forEach(presentation => {
      const category = presentation.category || 'uncategorized';
      stats.categories[category] = (stats.categories[category] || 0) + 1;
    });

    res.json({
      success: true,
      data: stats,
      timeframe
    });

  } catch (error) {
    console.error('Error fetching content stats:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: 'An error occurred while retrieving content statistics'
    });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const presentations = await presentationQueries.getAll();
    
    const categories = presentations.reduce((acc, presentation) => {
      const category = presentation.category || 'uncategorized';
      if (!acc[category]) {
        acc[category] = {
          name: category,
          count: 0,
          latest: null
        };
      }
      acc[category].count++;
      
      if (!acc[category].latest || 
          new Date(presentation.date_created) > new Date(acc[category].latest)) {
        acc[category].latest = presentation.date_created;
      }
      
      return acc;
    }, {});

    res.json({
      success: true,
      data: Object.values(categories).sort((a, b) => b.count - a.count)
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      message: 'An error occurred while retrieving categories'
    });
  }
});

// Get recent presentations
router.get('/recent', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const presentations = await presentationQueries.getAll({
      limit: parseInt(limit)
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
      data: enrichedPresentations
    });

  } catch (error) {
    console.error('Error fetching recent presentations:', error);
    res.status(500).json({
      error: 'Failed to fetch recent presentations',
      message: 'An error occurred while retrieving recent presentations'
    });
  }
});

// Get popular presentations
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10, timeframe = '30d' } = req.query;
    
    const presentations = await presentationQueries.getAll();
    
    // Sort by view count and download count
    const popular = presentations
      .sort((a, b) => {
        const scoreA = (a.view_count || 0) * 1 + (a.download_count || 0) * 2;
        const scoreB = (b.view_count || 0) * 1 + (b.download_count || 0) * 2;
        return scoreB - scoreA;
      })
      .slice(0, parseInt(limit))
      .map(presentation => ({
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
      data: popular,
      timeframe
    });

  } catch (error) {
    console.error('Error fetching popular presentations:', error);
    res.status(500).json({
      error: 'Failed to fetch popular presentations',
      message: 'An error occurred while retrieving popular presentations'
    });
  }
});

// Content management endpoints (for admin use)

// Get all presentations for management (includes private ones)
router.get('/admin/all', async (req, res) => {
  try {
    // Note: In a real application, this should be protected by authentication
    const { category, author, search, limit } = req.query;

    // Get all presentations including private ones
    const sql = `
      SELECT * FROM presentations 
      WHERE 1=1
      ${category ? 'AND category = ?' : ''}
      ${author ? 'AND author LIKE ?' : ''}
      ${search ? 'AND (title LIKE ? OR description LIKE ?)' : ''}
      ORDER BY date_created DESC
      ${limit ? 'LIMIT ?' : ''}
    `;

    // This would need to be implemented in the database queries
    // For now, we'll use the existing method and note the limitation
    const presentations = await presentationQueries.getAll({
      category,
      author,
      search,
      limit: limit ? parseInt(limit) : undefined
    });

    res.json({
      success: true,
      data: presentations.map(presentation => ({
        ...presentation,
        thumbnail: presentation.thumbnail_path 
          ? `/api/thumbnails/${path.basename(presentation.thumbnail_path)}`
          : null,
        // Keep file paths for admin
        file_url: `/api/files/${presentation.id}/download`
      }))
    });

  } catch (error) {
    console.error('Error fetching admin presentations:', error);
    res.status(500).json({
      error: 'Failed to fetch presentations',
      message: 'An error occurred while retrieving presentations for management'
    });
  }
});

// Bulk operations
router.post('/admin/bulk', async (req, res) => {
  try {
    const { action, presentation_ids, updates } = req.body;

    if (!action || !presentation_ids || !Array.isArray(presentation_ids)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Action and presentation_ids array are required'
      });
    }

    const results = [];

    switch (action) {
      case 'update':
        if (!updates) {
          return res.status(400).json({
            error: 'Updates required',
            message: 'Updates object is required for update action'
          });
        }

        for (const id of presentation_ids) {
          try {
            await presentationQueries.update(id, updates);
            results.push({ id, success: true });
          } catch (error) {
            results.push({ id, success: false, error: error.message });
          }
        }
        break;

      case 'delete':
        for (const id of presentation_ids) {
          try {
            // Get presentation to delete files
            const presentation = await presentationQueries.getById(id);
            if (presentation) {
              // Delete physical files
              try {
                await fs.unlink(presentation.file_path);
                if (presentation.thumbnail_path) {
                  await fs.unlink(presentation.thumbnail_path);
                }
              } catch (fileError) {
                console.warn(`Could not delete files for ${id}:`, fileError.message);
              }
              
              await presentationQueries.delete(id);
              results.push({ id, success: true });
            } else {
              results.push({ id, success: false, error: 'Presentation not found' });
            }
          } catch (error) {
            results.push({ id, success: false, error: error.message });
          }
        }
        break;

      default:
        return res.status(400).json({
          error: 'Invalid action',
          message: 'Supported actions: update, delete'
        });
    }

    res.json({
      success: true,
      message: `Bulk ${action} completed`,
      results
    });

  } catch (error) {
    console.error('Error in bulk operation:', error);
    res.status(500).json({
      error: 'Bulk operation failed',
      message: 'An error occurred while performing the bulk operation'
    });
  }
});

export default router;