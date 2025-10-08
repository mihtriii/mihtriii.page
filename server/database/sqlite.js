import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const DB_PATH = path.join(__dirname, '..', 'data', 'presentations.db');

let db = null;

// Initialize database connection
export function initializeDatabase() {
  return new Promise((resolve, reject) => {
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      
      console.log('Connected to SQLite database');
      createTables()
        .then(resolve)
        .catch(reject);
    });
  });
}

// Create database tables
async function createTables() {
  const createPresentationsTable = `
    CREATE TABLE IF NOT EXISTS presentations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      author TEXT NOT NULL,
      date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
      date_presented DATE,
      category TEXT,
      tags TEXT, -- JSON array as string
      file_path TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_size INTEGER,
      thumbnail_path TEXT,
      metadata TEXT, -- JSON object as string
      is_public BOOLEAN DEFAULT 1,
      view_count INTEGER DEFAULT 0,
      download_count INTEGER DEFAULT 0
    )
  `;

  const createFilesTable = `
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      presentation_id TEXT,
      original_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_size INTEGER,
      mime_type TEXT,
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_primary BOOLEAN DEFAULT 0,
      FOREIGN KEY (presentation_id) REFERENCES presentations (id) ON DELETE CASCADE
    )
  `;

  const createCommentsTable = `
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      presentation_id TEXT NOT NULL,
      author_name TEXT,
      author_email TEXT,
      content TEXT NOT NULL,
      date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_approved BOOLEAN DEFAULT 0,
      FOREIGN KEY (presentation_id) REFERENCES presentations (id) ON DELETE CASCADE
    )
  `;

  const createAnalyticsTable = `
    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      presentation_id TEXT,
      event_type TEXT NOT NULL, -- 'view', 'download', 'search', etc.
      user_agent TEXT,
      ip_address TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      metadata TEXT, -- JSON object as string
      FOREIGN KEY (presentation_id) REFERENCES presentations (id) ON DELETE SET NULL
    )
  `;

  try {
    await runQuery(createPresentationsTable);
    await runQuery(createFilesTable);
    await runQuery(createCommentsTable);
    await runQuery(createAnalyticsTable);
    
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

// Utility function to promisify database operations
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function allQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Database operations for presentations
export const presentationQueries = {
  // Create a new presentation
  async create(presentation) {
    const sql = `
      INSERT INTO presentations (
        id, title, description, author, date_presented, 
        category, tags, file_path, file_type, file_size, 
        thumbnail_path, metadata, is_public
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      presentation.id,
      presentation.title,
      presentation.description,
      presentation.author,
      presentation.date_presented,
      presentation.category,
      JSON.stringify(presentation.tags || []),
      presentation.file_path,
      presentation.file_type,
      presentation.file_size,
      presentation.thumbnail_path,
      JSON.stringify(presentation.metadata || {}),
      presentation.is_public !== false ? 1 : 0
    ];
    
    return await runQuery(sql, params);
  },

  // Get all presentations
  async getAll(filters = {}) {
    let sql = `
      SELECT * FROM presentations 
      WHERE is_public = 1
    `;
    const params = [];

    if (filters.category) {
      sql += ` AND category = ?`;
      params.push(filters.category);
    }

    if (filters.author) {
      sql += ` AND author LIKE ?`;
      params.push(`%${filters.author}%`);
    }

    if (filters.search) {
      sql += ` AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    sql += ` ORDER BY date_created DESC`;

    if (filters.limit) {
      sql += ` LIMIT ?`;
      params.push(parseInt(filters.limit));
    }

    const rows = await allQuery(sql, params);
    return rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]'),
      metadata: JSON.parse(row.metadata || '{}'),
      is_public: Boolean(row.is_public)
    }));
  },

  // Get presentation by ID
  async getById(id) {
    const sql = `SELECT * FROM presentations WHERE id = ?`;
    const row = await getQuery(sql, [id]);
    
    if (row) {
      return {
        ...row,
        tags: JSON.parse(row.tags || '[]'),
        metadata: JSON.parse(row.metadata || '{}'),
        is_public: Boolean(row.is_public)
      };
    }
    return null;
  },

  // Update presentation
  async update(id, updates) {
    const fields = [];
    const params = [];

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        if (key === 'tags' || key === 'metadata') {
          fields.push(`${key} = ?`);
          params.push(JSON.stringify(updates[key]));
        } else if (key === 'is_public') {
          fields.push(`${key} = ?`);
          params.push(updates[key] ? 1 : 0);
        } else {
          fields.push(`${key} = ?`);
          params.push(updates[key]);
        }
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const sql = `UPDATE presentations SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);

    return await runQuery(sql, params);
  },

  // Delete presentation
  async delete(id) {
    const sql = `DELETE FROM presentations WHERE id = ?`;
    return await runQuery(sql, [id]);
  },

  // Increment view count
  async incrementViewCount(id) {
    const sql = `UPDATE presentations SET view_count = view_count + 1 WHERE id = ?`;
    return await runQuery(sql, [id]);
  },

  // Increment download count
  async incrementDownloadCount(id) {
    const sql = `UPDATE presentations SET download_count = download_count + 1 WHERE id = ?`;
    return await runQuery(sql, [id]);
  }
};

// Database operations for files
export const fileQueries = {
  // Create a new file record
  async create(file) {
    const sql = `
      INSERT INTO files (
        id, presentation_id, original_name, file_path, 
        file_type, file_size, mime_type, is_primary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      file.id,
      file.presentation_id,
      file.original_name,
      file.file_path,
      file.file_type,
      file.file_size,
      file.mime_type,
      file.is_primary ? 1 : 0
    ];
    
    return await runQuery(sql, params);
  },

  // Get files by presentation ID
  async getByPresentationId(presentationId) {
    const sql = `SELECT * FROM files WHERE presentation_id = ? ORDER BY is_primary DESC, upload_date ASC`;
    const rows = await allQuery(sql, [presentationId]);
    return rows.map(row => ({
      ...row,
      is_primary: Boolean(row.is_primary)
    }));
  },

  // Delete file
  async delete(id) {
    const sql = `DELETE FROM files WHERE id = ?`;
    return await runQuery(sql, [id]);
  }
};

// Database operations for analytics
export const analyticsQueries = {
  // Record an event
  async recordEvent(event) {
    const sql = `
      INSERT INTO analytics (
        presentation_id, event_type, user_agent, 
        ip_address, metadata
      ) VALUES (?, ?, ?, ?, ?)
    `;
    
    const params = [
      event.presentation_id,
      event.event_type,
      event.user_agent,
      event.ip_address,
      JSON.stringify(event.metadata || {})
    ];
    
    return await runQuery(sql, params);
  },

  // Get analytics data
  async getStats(presentationId = null, timeframe = '30d') {
    let sql = `
      SELECT 
        event_type,
        COUNT(*) as count,
        DATE(timestamp) as date
      FROM analytics
    `;
    const params = [];

    if (presentationId) {
      sql += ` WHERE presentation_id = ?`;
      params.push(presentationId);
    }

    // Add timeframe filter
    const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
    const days = daysMap[timeframe] || 30;
    
    sql += presentationId ? ` AND` : ` WHERE`;
    sql += ` timestamp >= datetime('now', '-${days} days')`;
    sql += ` GROUP BY event_type, DATE(timestamp) ORDER BY date DESC`;

    const rows = await allQuery(sql, params);
    return rows.map(row => ({
      ...row,
      metadata: JSON.parse(row.metadata || '{}')
    }));
  }
};

// Close database connection
export function closeDatabase() {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}