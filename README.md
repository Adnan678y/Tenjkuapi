# Anime API Documentation

Base URL: `http://localhost:3000/api/v1`

## Authentication

Currently, this API does not require authentication.

## Rate Limiting

- 100 requests per 15 minutes per IP
- After 50 requests, responses will be delayed by 500ms

## Endpoints

### Health Check

```http
GET /health
```

Returns the API health status.

**Response**
```json
{
  "status": "healthy",
  "timestamp": "2025-03-10T12:00:00.000Z",
  "uptime": 3600
}
```

### Home Page

```http
GET /home
```

Returns popular and new release items.

**Response**
```json
{
  "Popular": {
    "Total": 10,
    "items": [
      {
        "ID": 1,
        "name": "Anime Name",
        "img": "image_url"
      }
    ]
  },
  "New release": {
    "Total": 5,
    "items": [
      {
        "ID": 2,
        "name": "New Anime",
        "img": "image_url"
      }
    ]
  }
}
```

### Get Anime by ID

```http
GET /id/:id
```

Returns details for a specific anime.

**Parameters**
- `id` (path parameter): Anime ID (integer)

**Response**
```json
{
  "ID": 1,
  "name": "Anime Name",
  "rating": 8.5,
  "year": 2025,
  "genre": ["Action", "Adventure"],
  "tag": ["popular"],
  "description": "Anime description",
  "img": "image_url",
  "created_at": "2025-03-10T12:00:00.000Z"
}
```

### Create Anime

```http
POST /anime
```

Creates a new anime entry.

**Request Body**
```json
{
  "name": "Anime Name",
  "rating": 8.5,
  "year": 2025,
  "genre": ["Action", "Adventure"],
  "tag": ["popular"],
  "description": "Anime description",
  "img": "image_url"
}
```

**Validation Rules**
- `name`: Required, non-empty string
- `rating`: Number between 0 and 10
- `year`: Integer between 1900 and current year
- `genre`: Array of strings
- `tag`: Array of strings

**Response**
```json
{
  "ID": 1,
  "name": "Anime Name",
  "rating": 8.5,
  "year": 2025,
  "genre": ["Action", "Adventure"],
  "tag": ["popular"],
  "description": "Anime description",
  "img": "image_url",
  "created_at": "2025-03-10T12:00:00.000Z"
}
```

### Batch Update

```http
POST /batch-update
```

Updates multiple anime entries in a single request.

**Request Body**
```json
{
  "updates": [
    {
      "id": 1,
      "data": {
        "rating": 9.0,
        "tag": ["popular", "trending"]
      }
    },
    {
      "id": 2,
      "data": {
        "rating": 8.5,
        "description": "Updated description"
      }
    }
  ]
}
```

**Limitations**
- Maximum 100 updates per request

**Response**
```json
{
  "message": "Batch update successful"
}
```

### Analytics

```http
GET /analytics
```

Returns analytics data for anime entries.

**Query Parameters**
- `period`: Time period for analysis (default: 'week')
  - Options: 'day', 'week', 'month', 'year'

**Response**
```json
{
  "total": 100,
  "new": 5,
  "averageRating": 8.5,
  "genreDistribution": {
    "Action": 30,
    "Adventure": 25,
    "Comedy": 20
  },
  "yearDistribution": {
    "2025": 10,
    "2024": 15,
    "2023": 20
  },
  "timestamp": "2025-03-10T12:00:00.000Z"
}
```

### Query Anime

```http
GET /query
```

Search and filter anime entries.

**Query Parameters**
- `name`: Search by name (fuzzy search)
- `tag`: Filter by tags (comma-separated)
- `genre`: Filter by genres (comma-separated)
- `description`: Search in description
- `year`: Filter by year
- `minRating`: Minimum rating
- `maxRating`: Maximum rating
- `sort`: Sort field
- `order`: Sort order ('asc' or 'desc', default: 'asc')
- `limit`: Results per page (default: 10)
- `page`: Page number (default: 1)

**Response**
```json
{
  "items": [
    {
      "ID": 1,
      "name": "Anime Name",
      "rating": 8.5,
      "year": 2025,
      "genre": ["Action", "Adventure"],
      "tag": ["popular"],
      "description": "Anime description",
      "img": "image_url"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "totalPages": 10,
    "limit": 10
  }
}
```

### File Upload

```http
POST /upload
```

Upload an image file.

**Request**
- Content-Type: `multipart/form-data`
- Field name: `file`

**Limitations**
- Maximum file size: 5MB
- Allowed formats: JPEG, PNG, WebP

**Response**
```json
{
  "message": "File uploaded successfully",
  "url": "http://localhost:3000/uploads/filename.jpg"
}
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "error": "Error message",
  "message": "Detailed error message (in development mode)"
}
```

Common HTTP status codes:
- 400: Bad Request (validation errors)
- 404: Not Found
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error

## Caching

- Home page: 5 minutes
- Anime details: 5 minutes
- Analytics: 10 minutes

Cache is automatically invalidated when data is modified through POST, PUT, or DELETE operations.
