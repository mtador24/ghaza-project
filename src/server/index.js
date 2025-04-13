
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './db.js';
import * as projectsService from './projectsService.js';
import * as donationsService from './donationsService.js';
import * as authService from './authService.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Serve static files from the public directory
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'public', 'uploads')));

// Authentication middleware for admin routes
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'يرجى تسجيل الدخول' });
  }
  
  try {
    const user = await authService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'الرمز غير صالح أو منتهي الصلاحية' });
  }
};

// Test database connection
app.get('/api/test-connection', async (req, res) => {
  const connected = await testConnection();
  res.json({ connected });
});

// Projects endpoints
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await projectsService.getActiveProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await projectsService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'المشروع غير موجود' });
    }
    
    // Get project images
    const images = await projectsService.getProjectImages(req.params.id);
    
    // Get project donations
    const donations = await projectsService.getProjectDonations(req.params.id);
    
    res.json({
      ...project,
      images,
      donations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin project endpoints
app.get('/api/admin/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await projectsService.getAdminProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new project with images
app.post('/api/admin/projects', authenticateToken, upload.array('projectImages', 10), async (req, res) => {
  try {
    const { title, description, goal, startDate, endDate, userId, mainImageIndex } = req.body;
    
    // Create the project in the database
    const projectId = await projectsService.createProject(
      {
        title,
        description,
        goal: parseFloat(goal),
        startDate,
        endDate: endDate || null
      },
      userId
    );
    
    // Upload project images if any
    if (req.files && req.files.length > 0) {
      await projectsService.uploadProjectImages(projectId, req.files, mainImageIndex);
    }
    
    res.status(201).json({ 
      message: 'تم إنشاء المشروع بنجاح',
      projectId
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update project
app.put('/api/admin/projects/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { title, description, goal, startDate, endDate, isActive } = req.body;
    
    await projectsService.updateProject(
      projectId,
      {
        title,
        description,
        goal: parseFloat(goal),
        startDate,
        endDate: endDate || null,
        isActive: isActive === 'true' || isActive === true
      }
    );
    
    res.json({ message: 'تم تحديث المشروع بنجاح' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
app.delete('/api/admin/projects/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    await projectsService.deleteProject(projectId);
    res.json({ message: 'تم حذف المشروع بنجاح' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add images to an existing project
app.post('/api/admin/projects/:id/images', authenticateToken, upload.array('projectImages', 10), async (req, res) => {
  try {
    const projectId = req.params.id;
    const { mainImageIndex } = req.body;
    
    if (req.files && req.files.length > 0) {
      await projectsService.uploadProjectImages(projectId, req.files, mainImageIndex);
    }
    
    res.status(201).json({ message: 'تم إضافة الصور بنجاح' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Donations endpoints
app.get('/api/donations/latest', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const donations = await donationsService.getLatestDonations(limit);
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/donations/stats', async (req, res) => {
  try {
    const stats = await donationsService.getDonationStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/donations/monthly', async (req, res) => {
  try {
    const projectId = req.query.projectId;
    const data = await donationsService.getMonthlyDonationsByYear(projectId || null);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auth endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    
    if (!result) {
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
