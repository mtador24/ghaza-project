
import { query } from './db';

// دالة للحصول على جميع طرق الدفع
export async function getAllPaymentMethods(activeOnly = false) {
  const sql = activeOnly 
    ? `SELECT * FROM payment_methods WHERE is_active = TRUE ORDER BY name`
    : `SELECT * FROM payment_methods ORDER BY name`;
  
  return await query(sql);
}

// دالة للحصول على طريقة دفع محددة بواسطة المعرف
export async function getPaymentMethodById(id) {
  const result = await query(
    `SELECT * FROM payment_methods WHERE id = ?`,
    [id]
  );
  
  return result.length > 0 ? result[0] : null;
}

// دالة لإضافة طريقة دفع جديدة
export async function addPaymentMethod(paymentMethodData) {
  const { name, description, icon, instructions, account_number, is_active } = paymentMethodData;
  
  const result = await query(
    `INSERT INTO payment_methods (name, description, icon, instructions, account_number, is_active) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, icon, instructions, account_number, is_active ? 1 : 0]
  );
  
  return result.insertId;
}

// دالة لتحديث طريقة دفع
export async function updatePaymentMethod(id, paymentMethodData) {
  const { name, description, icon, instructions, account_number, is_active } = paymentMethodData;
  
  await query(
    `UPDATE payment_methods 
     SET name = ?, description = ?, icon = ?, instructions = ?, account_number = ?, is_active = ? 
     WHERE id = ?`,
    [name, description, icon, instructions, account_number, is_active ? 1 : 0, id]
  );
  
  return true;
}

// دالة لحذف طريقة دفع
export async function deletePaymentMethod(id) {
  await query(
    `DELETE FROM payment_methods WHERE id = ?`,
    [id]
  );
  
  return true;
}

// دالة لتغيير حالة طريقة الدفع (نشط/غير نشط)
export async function togglePaymentMethodStatus(id, isActive) {
  await query(
    `UPDATE payment_methods SET is_active = ? WHERE id = ?`,
    [isActive ? 1 : 0, id]
  );
  
  return true;
}
