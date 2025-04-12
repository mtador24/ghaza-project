
import express from 'express';
import cors from 'cors';
import { 
  getAllPaymentMethods, 
  getPaymentMethodById, 
  addPaymentMethod, 
  updatePaymentMethod, 
  deletePaymentMethod, 
  togglePaymentMethodStatus 
} from './paymentMethodsService.js';
import { addDonation } from './donationsService.js';
import { verifyToken } from './authService.js';

const router = express.Router();

// وسيط للتأكد من تسجيل الدخول للأدمن
const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'غير مصرح. يرجى تسجيل الدخول.' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.isAdmin) {
      return res.status(403).json({ message: 'لا تملك الصلاحيات الكافية.' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'غير مصرح. يرجى تسجيل الدخول.' });
  }
};

// طرق API الخاصة بطرق الدفع
router.get('/payment-methods', async (req, res) => {
  try {
    const activeOnly = req.query.active === 'true';
    const methods = await getAllPaymentMethods(activeOnly);
    res.json(methods);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

router.get('/payment-methods/:id', async (req, res) => {
  try {
    const method = await getPaymentMethodById(req.params.id);
    if (!method) {
      return res.status(404).json({ message: 'طريقة الدفع غير موجودة' });
    }
    res.json(method);
  } catch (error) {
    console.error('Error fetching payment method:', error);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

router.post('/payment-methods', requireAdmin, async (req, res) => {
  try {
    const id = await addPaymentMethod(req.body);
    res.status(201).json({ id, ...req.body });
  } catch (error) {
    console.error('Error adding payment method:', error);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

router.put('/payment-methods/:id', requireAdmin, async (req, res) => {
  try {
    const existing = await getPaymentMethodById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'طريقة الدفع غير موجودة' });
    }
    
    await updatePaymentMethod(req.params.id, req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Error updating payment method:', error);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

router.delete('/payment-methods/:id', requireAdmin, async (req, res) => {
  try {
    const existing = await getPaymentMethodById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'طريقة الدفع غير موجودة' });
    }
    
    await deletePaymentMethod(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

router.patch('/payment-methods/:id/toggle-status', requireAdmin, async (req, res) => {
  try {
    const existing = await getPaymentMethodById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'طريقة الدفع غير موجودة' });
    }
    
    await togglePaymentMethodStatus(req.params.id, req.body.is_active);
    res.json({ ...existing, is_active: req.body.is_active });
  } catch (error) {
    console.error('Error toggling payment method status:', error);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

// طرق API الخاصة بالتبرعات
router.post('/donations', async (req, res) => {
  try {
    const donationId = await addDonation(req.body);
    res.status(201).json({ id: donationId, ...req.body });
  } catch (error) {
    console.error('Error adding donation:', error);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

export default router;
