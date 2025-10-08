import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import mime from 'mime-types';

import { presentationQueries, fileQueries, analyticsQueries } from '../database/sqlite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Create uploads directory if it doesn't exist
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const THUMBNAILS_DIR = path.join(UPLOADS_DIR, 'thumbnails');

async function ensureDirectories() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
  
  try {
    await fs.access(THUMBNAILS_DIR);
  } catch {
    await fs.mkdir(THUMBNAILS_DIR, { recursive: true });
  }
}

// Initialize directories
ensureDirectories();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureDirectories();
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // Generate unique filename while preserving extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    // Documents
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.oasis.opendocument.presentation',
    
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    
    // Archives
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    
    // Code/Text
    'text/plain',
    'application/json',
    'text/markdown',
    
    // LaTeX
    'application/x-tex',
    'text/x-tex'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 5 // Maximum 5 files per request
  }
});

// Helper function to generate thumbnail for PDFs
async function generatePdfThumbnail(filePath, thumbnailPath) {
  try {
    // This is a placeholder - in a real implementation, you might use
    // pdf2pic or similar library to generate thumbnails from PDFs
    
    // For now, we'll create a simple placeholder image
    await sharp({
      create: {
        width: 200,
        height: 150,
        channels: 4,
        background: { r: 240, g: 240, b: 240, alpha: 1 }
      }
    })
    .png()
    .toFile(thumbnailPath);
    
    return thumbnailPath;
  } catch (error) {
    console.error('Error generating PDF thumbnail:', error);
    return null;
  }
}

// Helper function to generate image thumbnail
async function generateImageThumbnail(filePath, thumbnailPath) {
  try {
    await sharp(filePath)
      .resize(200, 150, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);
    
    return thumbnailPath;
  } catch (error) {
    console.error('Error generating image thumbnail:', error);
    return null;
  }
}

// Helper function to extract text content from files (placeholder)
async function extractFileText(filePath, mimeType) {
  try {
    // For now, return empty string. In a real implementation, you could use:
    // - pdf2pic for PDFs
    // - mammoth for Word documents
    // - xlsx for Excel files
    return '';
  } catch (error) {
    console.error('Error extracting file text:', error);
    return '';
  }
}

// Upload endpoint
router.post('/', upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded',
        message: 'Please select at least one file to upload'
      });
    }

    const {
      title,
      description,
      author,
      date_presented,
      category,
      tags,
      is_public = true
    } = req.body;

    // Validate required fields
    if (!title || !author) {
      // Clean up uploaded files
      for (const file of req.files) {
        await fs.unlink(file.path).catch(console.error);
      }
      
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Title and author are required'
      });
    }

    // Generate unique ID for the presentation
    const presentationId = uuidv4();
    
    // Process uploaded files
    const processedFiles = [];
    let primaryFile = null;
    let thumbnailPath = null;

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const fileId = uuidv4();
      const isPrimary = i === 0; // First file is primary

      if (isPrimary) {
        primaryFile = file;
        
        // Generate thumbnail for primary file
        const thumbnailFilename = `thumb-${presentationId}.jpg`;
        const thumbnailFullPath = path.join(THUMBNAILS_DIR, thumbnailFilename);
        
        if (file.mimetype.startsWith('image/')) {
          thumbnailPath = await generateImageThumbnail(file.path, thumbnailFullPath);
        } else if (file.mimetype === 'application/pdf') {
          thumbnailPath = await generatePdfThumbnail(file.path, thumbnailFullPath);
        }
      }

      // Store file record
      const fileRecord = {
        id: fileId,
        presentation_id: presentationId,
        original_name: file.originalname,
        file_path: file.path,
        file_type: path.extname(file.originalname).toLowerCase(),
        file_size: file.size,
        mime_type: file.mimetype,
        is_primary: isPrimary
      };

      await fileQueries.create(fileRecord);
      processedFiles.push({
        ...fileRecord,
        url: `/api/files/${fileId}`
      });
    }

    // Extract metadata from primary file
    let extractedText = '';
    if (primaryFile) {
      extractedText = await extractFileText(primaryFile.path, primaryFile.mimetype);
    }

    // Create presentation record
    const presentation = {
      id: presentationId,
      title,
      description: description || '',
      author,
      date_presented: date_presented || null,
      category: category || 'general',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      file_path: primaryFile.path,
      file_type: path.extname(primaryFile.originalname).toLowerCase(),
      file_size: primaryFile.size,
      thumbnail_path: thumbnailPath ? path.relative(UPLOADS_DIR, thumbnailPath) : null,
      metadata: {
        original_filename: primaryFile.originalname,
        mime_type: primaryFile.mimetype,
        extracted_text: extractedText.substring(0, 5000), // Store first 5000 chars
        upload_timestamp: new Date().toISOString(),
        files_count: req.files.length
      },
      is_public: is_public !== 'false' && is_public !== false
    };

    await presentationQueries.create(presentation);

    // Record analytics event
    await analyticsQueries.recordEvent({
      presentation_id: presentationId,
      event_type: 'upload',
      user_agent: req.get('User-Agent'),
      ip_address: req.ip,
      metadata: {
        files_count: req.files.length,
        total_size: req.files.reduce((sum, file) => sum + file.size, 0)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Files uploaded successfully',
      data: {
        presentation: {
          id: presentationId,
          title,
          description,
          author,
          category,
          tags: presentation.tags,
          thumbnail: thumbnailPath ? `/api/thumbnails/${path.basename(thumbnailPath)}` : null,
          created_at: new Date().toISOString()
        },
        files: processedFiles
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded files on error
    if (req.files) {
      for (const file of req.files) {
        await fs.unlink(file.path).catch(console.error);
      }
    }

    res.status(500).json({
      error: 'Upload failed',
      message: 'An error occurred while processing the upload'
    });
  }
});

// Get upload progress (for chunked uploads - future enhancement)
router.get('/progress/:uploadId', (req, res) => {
  // This would be implemented for large file uploads with progress tracking
  res.json({
    uploadId: req.params.uploadId,
    progress: 100,
    status: 'completed'
  });
});

// Validate file before upload
router.post('/validate', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file provided',
        valid: false
      });
    }

    // Clean up the validation file
    await fs.unlink(req.file.path);

    res.json({
      valid: true,
      fileInfo: {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size
      }
    });

  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({
      error: 'Validation failed',
      valid: false
    });
  }
});

export default router;