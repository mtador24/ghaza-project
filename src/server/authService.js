
import { query } from './db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// مفتاح سري لتوقيع الرمز المميز JWT (يجب أن يكون في متغيرات البيئة)
const JWT_SECRET = process.env.JWT_SECRET || 'gaza_aid_platform_secret_key';

// دالة للتحقق من صحة اسم المستخدم وكلمة المرور
export async function login(username, password) {
  const users = await query(
    `SELECT id, username, password, name, role FROM users WHERE username = ?`,
    [username]
  );
  
  if (users.length === 0) {
    return null;
  }
  
  const user = users[0];
  
  // التحقق من صحة كلمة المرور
  const passwordMatch = await bcrypt.compare(password, user.password);
  
  if (!passwordMatch) {
    return null;
  }
  
  // إنشاء رمز مميز JWT
  const token = jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role 
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
  
  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    }
  };
}

// دالة للتحقق من صحة الرمز المميز JWT
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// دالة لتغيير كلمة المرور
export async function changePassword(userId, currentPassword, newPassword) {
  // الحصول على كلمة المرور الحالية من قاعدة البيانات
  const users = await query(
    `SELECT password FROM users WHERE id = ?`,
    [userId]
  );
  
  if (users.length === 0) {
    return { success: false, message: 'المستخدم غير موجود' };
  }
  
  // التحقق من صحة كلمة المرور الحالية
  const passwordMatch = await bcrypt.compare(currentPassword, users[0].password);
  
  if (!passwordMatch) {
    return { success: false, message: 'كلمة المرور الحالية غير صحيحة' };
  }
  
  // تشفير كلمة المرور الجديدة
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  // تحديث كلمة المرور في قاعدة البيانات
  await query(
    `UPDATE users SET password = ? WHERE id = ?`,
    [hashedPassword, userId]
  );
  
  return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
}

// Get admin profile information
export async function getAdminProfile(userId) {
  const users = await query(
    `SELECT id, username, name, email FROM users WHERE id = ? AND role = 'admin'`,
    [userId]
  );
  
  if (users.length === 0) {
    throw new Error('المستخدم غير موجود');
  }
  
  return users[0];
}

// Update admin profile information
export async function updateAdminProfile(userId, { name, email }) {
  // Check if admin exists
  const users = await query(
    `SELECT id FROM users WHERE id = ? AND role = 'admin'`,
    [userId]
  );
  
  if (users.length === 0) {
    throw new Error('المستخدم غير موجود');
  }
  
  // Update profile info
  await query(
    `UPDATE users SET name = ?, email = ? WHERE id = ?`,
    [name, email, userId]
  );
  
  return { success: true };
}
