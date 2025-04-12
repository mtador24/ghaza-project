
import { query } from './db';

// دالة للحصول على جميع المشاريع النشطة
export async function getActiveProjects() {
  return await query(
    `SELECT p.*, 
     (SELECT image_url FROM project_images WHERE project_id = p.id AND is_main = 1 LIMIT 1) as main_image 
     FROM projects p 
     WHERE p.is_active = 1 
     ORDER BY p.created_at DESC`
  );
}

// دالة للحصول على تفاصيل مشروع معين
export async function getProjectById(projectId) {
  const projects = await query(
    `SELECT * FROM projects WHERE id = ?`,
    [projectId]
  );
  
  if (projects.length === 0) {
    return null;
  }
  
  return projects[0];
}

// دالة للحصول على صور مشروع معين
export async function getProjectImages(projectId) {
  return await query(
    `SELECT * FROM project_images WHERE project_id = ? ORDER BY is_main DESC, id ASC`,
    [projectId]
  );
}

// دالة للحصول على التبرعات الخاصة بمشروع معين
export async function getProjectDonations(projectId) {
  return await query(
    `SELECT d.*, dn.name as donor_name 
     FROM donations d 
     JOIN donors dn ON d.donor_id = dn.id 
     WHERE d.project_id = ? 
     ORDER BY d.donation_date DESC`,
    [projectId]
  );
}

// دالة لإنشاء مشروع جديد
export async function createProject(projectData, userId) {
  const { title, description, goal, startDate, endDate } = projectData;
  
  const result = await query(
    `INSERT INTO projects (title, description, goal, start_date, end_date, created_by) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, goal, startDate, endDate, userId]
  );
  
  return result.insertId;
}

// دالة لتحديث بيانات مشروع
export async function updateProject(projectId, projectData) {
  const { title, description, goal, startDate, endDate, isActive } = projectData;
  
  return await query(
    `UPDATE projects 
     SET title = ?, description = ?, goal = ?, start_date = ?, end_date = ?, is_active = ? 
     WHERE id = ?`,
    [title, description, goal, startDate, endDate, isActive, projectId]
  );
}

// دالة لحذف مشروع
export async function deleteProject(projectId) {
  return await query(
    `DELETE FROM projects WHERE id = ?`,
    [projectId]
  );
}

// دالة لإضافة صورة لمشروع
export async function addProjectImage(projectId, imageUrl, isMain = false) {
  // إذا كانت الصورة رئيسية، قم بإلغاء تعيين الصور الرئيسية الأخرى
  if (isMain) {
    await query(
      `UPDATE project_images SET is_main = 0 WHERE project_id = ?`,
      [projectId]
    );
  }
  
  return await query(
    `INSERT INTO project_images (project_id, image_url, is_main) VALUES (?, ?, ?)`,
    [projectId, imageUrl, isMain]
  );
}

// دالة للحصول على إحصائيات التبرعات الشهرية لمشروع
export async function getMonthlyDonations(projectId = null) {
  const sql = projectId 
    ? `SELECT DATE_FORMAT(donation_date, '%Y-%m') as month, SUM(amount) as total 
       FROM donations 
       WHERE project_id = ? 
       GROUP BY DATE_FORMAT(donation_date, '%Y-%m') 
       ORDER BY month`
    : `SELECT DATE_FORMAT(donation_date, '%Y-%m') as month, SUM(amount) as total 
       FROM donations 
       GROUP BY DATE_FORMAT(donation_date, '%Y-%m') 
       ORDER BY month`;
       
  const params = projectId ? [projectId] : [];
  return await query(sql, params);
}
