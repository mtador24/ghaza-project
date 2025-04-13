
import express from 'express';
import cors from 'cors';
import { testConnection } from './db.js';
import * as projectsService from './projectsService.js';
import * as donationsService from './donationsService.js';
import * as authService from './authService.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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
