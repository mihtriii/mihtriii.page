# Server Usage Instructions

## Starting the Server

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will run on http://localhost:3001

## Available Endpoints

### File Upload API
- `POST /api/upload` - Upload presentation files
- `POST /api/upload/validate` - Validate files before upload

### Presentations API
- `GET /api/presentations` - List all presentations
- `GET /api/presentations/:id` - Get presentation details
- `GET /api/presentations/:id/download` - Download presentation
- `PUT /api/presentations/:id` - Update presentation
- `DELETE /api/presentations/:id` - Delete presentation

### Content Management API
- `GET /api/content/stats` - Get content statistics
- `GET /api/content/categories` - Get all categories
- `GET /api/content/recent` - Get recent presentations
- `GET /api/content/popular` - Get popular presentations

## Using the Admin Interface

1. Start both the main website (frontend) and the server (backend)
2. Visit http://localhost:5173/admin
3. Use the admin panel to:
   - Upload new presentations
   - Manage existing content
   - View analytics and statistics

## Environment Variables

Copy `.env.example` to `.env` and configure as needed:

```bash
cp .env.example .env
```

## Database

The server uses SQLite database which will be automatically created in the `data/` directory when the server starts for the first time.