import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './db.js';
import * as projectsService from './projectsService.js';
import * as donationsService from './donationsService.js';
import * as authService from './authService.js';
import * as donorsService from './donorsService.js';
import * as paymentMethodsService from './paymentMethodsService.js';
import * as membersService from './membersService.js';
import fs from 'fs';

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

// Donors endpoints
app.get('/api/admin/donors', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    const result = await donorsService.getDonors(page, limit, search);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/donors/:id', authenticateToken, async (req, res) => {
  try {
    const donorId = req.params.id;
    const donor = await donorsService.getDonorDetails(donorId);
    
    if (!donor) {
      return res.status(404).json({ error: 'المتبرع غير موجود' });
    }
    
    res.json(donor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/donors/:id', authenticateToken, async (req, res) => {
  try {
    const donorId = req.params.id;
    const { name, email, phone } = req.body;
    
    await donorsService.updateDonor(donorId, { name, email, phone });
    res.json({ message: 'تم تحديث بيانات المتبرع بنجاح' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/donors/:id', authenticateToken, async (req, res) => {
  try {
    const donorId = req.params.id;
    await donorsService.deleteDonor(donorId);
    res.json({ message: 'تم حذف المتبرع بنجاح' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/admin/donors/:id/payment-proof', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const donorId = req.params.id;
    const { donationId, notes } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'يرجى تحميل صورة إثبات الدفع' });
    }
    
    // إنشاء مجلد لتخزين الصور إذا لم يكن موجودًا
    const uploadsDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'payments');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // إنشاء اسم ملف فريد
    const filename = `payment_${donorId}_${Date.now()}${path.extname(req.file.originalname)}`;
    const filePath = path.join(uploadsDir, filename);
    
    // حفظ الصورة
    await fs.promises.writeFile(filePath, req.file.buffer);
    
    // تخزين بيانات إثبات الدفع في قاعدة البيانات
    const imageUrl = `/uploads/payments/${filename}`;
    await donorsService.addPaymentProof(donorId, donationId, imageUrl, notes);
    
    res.status(201).json({ 
      message: 'تم إضافة إثبات الدفع بنجاح',
      imageUrl
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

// Payment Methods endpoints
app.get('/api/payment-methods', async (req, res) => {
  try {
    const paymentMethods = await paymentMethodsService.getAllPaymentMethods();
    res.json(paymentMethods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/payment-methods/:id', async (req, res) => {
  try {
    const paymentMethod = await paymentMethodsService.getPaymentMethodById(req.params.id);
    if (!paymentMethod) {
      return res.status(404).json({ error: 'طريقة الدفع غير موجودة' });
    }
    res.json(paymentMethod);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/payment-methods', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, address } = req.body;
    
    if (!name || !address || !req.file) {
      return res.status(400).json({ error: 'يرجى توفير جميع البيانات المطلوبة' });
    }
    
    const result = await paymentMethodsService.createPaymentMethod(
      { name, address },
      req.file.buffer,
      req.file.originalname
    );
    
    res.status(201).json({
      message: 'تم إضافة طريقة الدفع بنجاح',
      id: result.id,
      imageUrl: result.imageUrl
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/payment-methods/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, address } = req.body;
    const id = req.params.id;
    
    if (!name || !address) {
      return res.status(400).json({ error: 'يرجى توفير جميع البيانات المطلوبة' });
    }
    
    let result;
    if (req.file) {
      result = await paymentMethodsService.updatePaymentMethod(
        id,
        { name, address },
        req.file.buffer,
        req.file.originalname
      );
    } else {
      result = await paymentMethodsService.updatePaymentMethod(id, { name, address });
    }
    
    res.json({
      message: 'تم تحديث طريقة الدفع بنجاح',
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/payment-methods/:id', authenticateToken, async (req, res) => {
  try {
    await paymentMethodsService.deletePaymentMethod(req.params.id);
    res.json({ message: 'تم حذف طريقة الدفع بنجاح' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Profile endpoints
app.get('/api/admin/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await authService.getAdminProfile(userId);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, currentPassword, newPassword } = req.body;
    
    if (currentPassword && newPassword) {
      // Updating password
      const result = await authService.changePassword(userId, currentPassword, newPassword);
      if (!result.success) {
        return res.status(400).json({ error: result.message });
      }
    }
    
    // Update profile info
    await authService.updateAdminProfile(userId, { name, email });
    
    res.json({ message: 'تم تحديث الملف الشخصي بنجاح' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Members endpoints
app.get('/api/admin/members', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    const result = await membersService.getMembers(page, limit, search);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/members/:id', authenticateToken, async (req, res) => {
  try {
    const memberId = req.params.id;
    const member = await membersService.getMemberDetails(memberId);
    
    if (!member) {
      return res.status(404).json({ error: 'العضو غير موجود' });
    }
    
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/members/:id/status', authenticateToken, async (req, res) => {
  try {
    const memberId = req.params.id;
    const { isActive } = req.body;
    
    await membersService.updateMemberStatus(memberId, isActive);
    res.json({ message: `تم ${isActive ? 'تفعيل' : 'تعطيل'} العضو بنجاح` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/members/:id', authenticateToken, async (req, res) => {
  try {
    const memberId = req.params.id;
    await membersService.deleteMember(memberId);
    res.json({ message: 'تم حذف العضو بنجاح' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
