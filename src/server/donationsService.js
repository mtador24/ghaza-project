
import { query } from './db';

// دالة لإضافة متبرع جديد أو استخدام متبرع موجود
export async function findOrCreateDonor(donorData) {
  const { name, email, phone, country } = donorData;
  
  // البحث عن المتبرع بالبريد الإلكتروني إذا كان موجودًا
  if (email) {
    const existingDonors = await query(
      `SELECT id FROM donors WHERE email = ?`,
      [email]
    );
    
    if (existingDonors.length > 0) {
      // تحديث اسم المتبرع ورقم الهاتف والبلد إذا تغير
      await query(
        `UPDATE donors SET name = ?, phone = ?, country = ? WHERE id = ?`,
        [name, phone, country, existingDonors[0].id]
      );
      return existingDonors[0].id;
    }
  }
  
  // إنشاء متبرع جديد إذا لم يكن موجودًا
  const result = await query(
    `INSERT INTO donors (name, email, phone, country) VALUES (?, ?, ?, ?)`,
    [name, email || null, phone || null, country || null]
  );
  
  return result.insertId;
}

// دالة لإضافة تبرع جديد
export async function addDonation(donationData) {
  const { projectId, donorData, amount, notes, paymentMethodId, currency = "USD" } = donationData;
  
  // إيجاد أو إنشاء المتبرع
  const donorId = await findOrCreateDonor(donorData);
  
  // إضافة التبرع
  const result = await query(
    `INSERT INTO donations (project_id, donor_id, amount, currency, notes, payment_method_id) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [projectId, donorId, amount, currency, notes || null, paymentMethodId]
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

// دالة للحصول على إحصائيات التبرعات الشهرية لمشروع مع دعم السنوات
export async function getMonthlyDonationsByYear(projectId = null) {
  const sql = projectId 
    ? `SELECT 
         YEAR(donation_date) as year,
         MONTH(donation_date) as month_num, 
         CASE
           WHEN MONTH(donation_date) = 1 THEN 'يناير'
           WHEN MONTH(donation_date) = 2 THEN 'فبراير'
           WHEN MONTH(donation_date) = 3 THEN 'مارس'
           WHEN MONTH(donation_date) = 4 THEN 'أبريل'
           WHEN MONTH(donation_date) = 5 THEN 'مايو'
           WHEN MONTH(donation_date) = 6 THEN 'يونيو'
           WHEN MONTH(donation_date) = 7 THEN 'يوليو'
           WHEN MONTH(donation_date) = 8 THEN 'أغسطس'
           WHEN MONTH(donation_date) = 9 THEN 'سبتمبر'
           WHEN MONTH(donation_date) = 10 THEN 'أكتوبر'
           WHEN MONTH(donation_date) = 11 THEN 'نوفمبر'
           WHEN MONTH(donation_date) = 12 THEN 'ديسمبر'
         END as month,
         SUM(amount) as amount 
       FROM donations 
       WHERE project_id = ? 
       GROUP BY YEAR(donation_date), MONTH(donation_date)
       ORDER BY YEAR(donation_date) DESC, MONTH(donation_date) ASC`
    : `SELECT 
         YEAR(donation_date) as year,
         MONTH(donation_date) as month_num,
         CASE
           WHEN MONTH(donation_date) = 1 THEN 'يناير'
           WHEN MONTH(donation_date) = 2 THEN 'فبراير'
           WHEN MONTH(donation_date) = 3 THEN 'مارس'
           WHEN MONTH(donation_date) = 4 THEN 'أبريل'
           WHEN MONTH(donation_date) = 5 THEN 'مايو'
           WHEN MONTH(donation_date) = 6 THEN 'يونيو'
           WHEN MONTH(donation_date) = 7 THEN 'يوليو'
           WHEN MONTH(donation_date) = 8 THEN 'أغسطس'
           WHEN MONTH(donation_date) = 9 THEN 'سبتمبر'
           WHEN MONTH(donation_date) = 10 THEN 'أكتوبر'
           WHEN MONTH(donation_date) = 11 THEN 'نوفمبر'
           WHEN MONTH(donation_date) = 12 THEN 'ديسمبر'
         END as month,
         SUM(amount) as amount 
       FROM donations 
       GROUP BY YEAR(donation_date), MONTH(donation_date)
       ORDER BY YEAR(donation_date) DESC, MONTH(donation_date) ASC`;
       
  const params = projectId ? [projectId] : [];
  const results = await query(sql, params);
  
  // تحويل النتائج إلى صيغة مناسبة للرسم البياني
  return results.map(row => ({
    year: row.year.toString(),
    month: row.month,
    amount: row.amount
  }));
}

// دالة للحصول على السنوات التي تحتوي على تبرعات
export async function getDonationYears() {
  const sql = `SELECT DISTINCT YEAR(donation_date) as year FROM donations ORDER BY year DESC`;
  const results = await query(sql);
  return results.map(row => row.year.toString());
}
