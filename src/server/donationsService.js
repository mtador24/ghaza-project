
import { query } from './db';

// دالة لإضافة متبرع جديد أو استخدام متبرع موجود
export async function findOrCreateDonor(donorData) {
  const { name, email, phone } = donorData;
  
  // البحث عن المتبرع بالبريد الإلكتروني إذا كان موجودًا
  if (email) {
    const existingDonors = await query(
      `SELECT id FROM donors WHERE email = ?`,
      [email]
    );
    
    if (existingDonors.length > 0) {
      // تحديث اسم المتبرع ورقم الهاتف إذا تغير
      await query(
        `UPDATE donors SET name = ?, phone = ? WHERE id = ?`,
        [name, phone, existingDonors[0].id]
      );
      return existingDonors[0].id;
    }
  }
  
  // إنشاء متبرع جديد إذا لم يكن موجودًا
  const result = await query(
    `INSERT INTO donors (name, email, phone) VALUES (?, ?, ?)`,
    [name, email || null, phone || null]
  );
  
  return result.insertId;
}

// دالة لإضافة تبرع جديد
export async function addDonation(donationData) {
  const { projectId, donorData, amount, notes } = donationData;
  
  // إيجاد أو إنشاء المتبرع
  const donorId = await findOrCreateDonor(donorData);
  
  // إضافة التبرع
  const result = await query(
    `INSERT INTO donations (project_id, donor_id, amount, notes) VALUES (?, ?, ?, ?)`,
    [projectId, donorId, amount, notes || null]
  );
  
  // تحديث المبلغ المجمع للمشروع
  await query(
    `UPDATE projects 
     SET raised = raised + ? 
     WHERE id = ?`,
    [amount, projectId]
  );
  
  return result.insertId;
}

// دالة للحصول على أحدث التبرعات
export async function getLatestDonations(limit = 10) {
  return await query(
    `SELECT d.*, p.title as project_title, dn.name as donor_name 
     FROM donations d 
     JOIN projects p ON d.project_id = p.id 
     JOIN donors dn ON d.donor_id = dn.id 
     ORDER BY d.donation_date DESC 
     LIMIT ?`,
    [limit]
  );
}

// دالة للحصول على إجمالي التبرعات
export async function getTotalDonations() {
  const result = await query(
    `SELECT SUM(amount) as total FROM donations`
  );
  
  return result[0].total || 0;
}

// دالة للحصول على إحصائيات التبرعات
export async function getDonationStats() {
  const totalDonationsResult = await query(
    `SELECT SUM(amount) as total_donations FROM donations`
  );
  
  const totalDonorsResult = await query(
    `SELECT COUNT(DISTINCT donor_id) as total_donors FROM donations`
  );
  
  const activeProjectsResult = await query(
    `SELECT COUNT(*) as active_projects FROM projects WHERE is_active = 1`
  );
  
  const totalProjectsResult = await query(
    `SELECT COUNT(*) as total_projects FROM projects`
  );
  
  return {
    totalDonations: totalDonationsResult[0].total_donations || 0,
    totalDonors: totalDonorsResult[0].total_donors || 0,
    activeProjects: activeProjectsResult[0].active_projects || 0,
    totalProjects: totalProjectsResult[0].total_projects || 0
  };
}
