
import { query } from './db';

// دالة للحصول على جميع المتبرعين مع التصفح الصفحي
export async function getDonors(page = 1, limit = 10, searchTerm = '') {
  const offset = (page - 1) * limit;
  
  let sql = `
    SELECT dn.*, 
           COUNT(d.id) as total_donations,
           SUM(d.amount) as total_amount
    FROM donors dn
    LEFT JOIN donations d ON dn.id = d.donor_id
  `;
  
  let countSql = `SELECT COUNT(*) as total FROM donors dn`;
  let params = [];
  
  // إضافة البحث إذا تم تحديده
  if (searchTerm) {
    sql += ` WHERE dn.name LIKE ? OR dn.email LIKE ? OR dn.phone LIKE ?`;
    countSql += ` WHERE dn.name LIKE ? OR dn.email LIKE ? OR dn.phone LIKE ?`;
    params = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];
  }
  
  sql += ` GROUP BY dn.id ORDER BY dn.created_at DESC LIMIT ? OFFSET ?`;
  
  // إضافة معلمات الحد والإزاحة
  params.push(limit, offset);
  
  // تنفيذ الاستعلام للحصول على المتبرعين
  const donors = await query(sql, params);
  
  // تنفيذ استعلام العدد الإجمالي للمتبرعين
  const countParams = searchTerm ? [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`] : [];
  const countResult = await query(countSql, countParams);
  
  return {
    donors,
    pagination: {
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit)
    }
  };
}

// دالة للحصول على تفاصيل متبرع معين مع تبرعاته
export async function getDonorDetails(donorId) {
  // الحصول على بيانات المتبرع
  const donors = await query(
    `SELECT * FROM donors WHERE id = ?`,
    [donorId]
  );
  
  if (donors.length === 0) {
    return null;
  }
  
  const donor = donors[0];
  
  // الحصول على تبرعات المتبرع
  const donations = await query(
    `SELECT d.*, p.title as project_title
     FROM donations d
     JOIN projects p ON d.project_id = p.id
     WHERE d.donor_id = ?
     ORDER BY d.donation_date DESC`,
    [donorId]
  );
  
  // الحصول على إثباتات الدفع للمتبرع (إذا كانت موجودة)
  const paymentProofs = await query(
    `SELECT * FROM payment_proofs WHERE donor_id = ?`,
    [donorId]
  );
  
  return {
    ...donor,
    donations,
    paymentProofs
  };
}

// دالة لإضافة إثبات دفع
export async function addPaymentProof(donorId, donationId, imageUrl, notes = null) {
  return await query(
    `INSERT INTO payment_proofs (donor_id, donation_id, image_url, notes)
     VALUES (?, ?, ?, ?)`,
    [donorId, donationId, imageUrl, notes]
  );
}

// دالة لحذف متبرع (مع التحقق من عدم وجود تبرعات)
export async function deleteDonor(donorId) {
  // التحقق من وجود تبرعات
  const donations = await query(
    `SELECT COUNT(*) as count FROM donations WHERE donor_id = ?`,
    [donorId]
  );
  
  if (donations[0].count > 0) {
    throw new Error('لا يمكن حذف المتبرع لأنه قام بتبرعات مسجلة');
  }
  
  return await query(
    `DELETE FROM donors WHERE id = ?`,
    [donorId]
  );
}

// دالة لتحديث بيانات متبرع
export async function updateDonor(donorId, donorData) {
  const { name, email, phone } = donorData;
  
  return await query(
    `UPDATE donors SET name = ?, email = ?, phone = ? WHERE id = ?`,
    [name, email, phone, donorId]
  );
}

