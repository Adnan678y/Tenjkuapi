import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import Fuse from 'fuse.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database setup
const databasePath = path.join(__dirname, 'database.json');
const getDatabase = () => {
  if (!fs.existsSync(databasePath)) {
    fs.writeFileSync(databasePath, JSON.stringify([]));
    return [];
  }
  return JSON.parse(fs.readFileSync(databasePath));
};

const saveDatabase = (data) => {
  fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
};

// Upload configuration
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Routes
app.get('/home', (req, res) => {
  try {
    const data = getDatabase();
    const popularItems = data.filter(item => item.tag?.includes('popular'));
    const newReleaseItems = data.filter(item => item.tag?.includes('New release'));

    res.json({
      Popular: { 
        Total: popularItems.length, 
        items: popularItems.map(({ ID, name, img }) => ({ ID, name, img })) 
      },
      'New release': { 
        Total: newReleaseItems.length, 
        items: newReleaseItems.map(({ ID, name, img }) => ({ ID, name, img })) 
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch home data' });
  }
});

app.get('/id/:id', (req, res) => {
  try {
    const data = getDatabase();
    const anime = data.find(item => item.ID === parseInt(req.params.id, 10));
    if (anime) {
      res.json(anime);
    } else {
      res.status(404).json({ error: 'Anime not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch anime' });
  }
});

app.post('/anime', (req, res) => {
  try {
    const data = getDatabase();
    const newAnime = {
      ID: Date.now(),
      ...req.body,
      created_at: new Date().toISOString()
    };
    
    data.push(newAnime);
    saveDatabase(data);
    
    res.status(201).json(newAnime);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create anime' });
  }
});

app.put('/anime/:id', (req, res) => {
  try {
    const data = getDatabase();
    const id = parseInt(req.params.id, 10);
    const index = data.findIndex(item => item.ID === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Anime not found' });
    }
    
    data[index] = {
      ...data[index],
      ...req.body,
      updated_at: new Date().toISOString()
    };
    
    saveDatabase(data);
    res.json(data[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update anime' });
  }
});

app.delete('/anime/:id', (req, res) => {
  try {
    const data = getDatabase();
    const id = parseInt(req.params.id, 10);
    const index = data.findIndex(item => item.ID === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Anime not found' });
    }
    
    data.splice(index, 1);
    saveDatabase(data);
    
    res.json({ message: 'Anime deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete anime' });
  }
});

app.get('/query', (req, res) => {
  try {
    const data = getDatabase();
    let { name, tag, genre, description, year, minRating, maxRating, sort, order = 'asc', limit = 10, page = 1 } = req.query;
    let results = [...data];

    // Search by name using Fuse.js
    if (name) {
      const fuse = new Fuse(results, {
        keys: ['name'],
        threshold: 0.3
      });
      results = fuse.search(name).map(result => result.item);
    }

    // Filters
    if (tag) results = results.filter(item => item.tag?.some(t => tag.split(',').includes(t)));
    if (genre) results = results.filter(item => item.genre?.some(g => genre.split(',').includes(g)));
    if (description) results = results.filter(item => item.description?.toLowerCase().includes(description.toLowerCase()));
    if (year) results = results.filter(item => item.year === parseInt(year, 10));
    if (minRating) results = results.filter(item => item.rating >= parseFloat(minRating));
    if (maxRating) results = results.filter(item => item.rating <= parseFloat(maxRating));

    // Sorting
    if (sort) {
      results.sort((a, b) => {
        if (sort === 'name') {
          return order === 'desc' 
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name);
        }
        return order === 'desc' 
          ? b[sort] - a[sort]
          : a[sort] - b[sort];
      });
    }

    // Pagination
    const totalItems = results.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const paginatedResults = results.slice(startIndex, startIndex + limit);

    res.json({
      items: paginatedResults,
      pagination: {
        total: totalItems,
        page: parseInt(page, 10),
        totalPages,
        limit: parseInt(limit, 10)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to query anime' });
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ 
      message: 'File uploaded successfully',
      url: fileUrl
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});