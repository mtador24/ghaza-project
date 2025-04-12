
import mysql from 'mysql2/promise';

// إعداد متغيرات الاتصال بقاعدة البيانات
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gaza_aid_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// إنشاء مجمع اتصالات لقاعدة البيانات
const pool = mysql.createPool(dbConfig);

// دالة لاختبار الاتصال بقاعدة البيانات
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('تم الاتصال بقاعدة البيانات بنجاح!');
    connection.release();
    return true;
  } catch (error) {
    console.error('فشل الاتصال بقاعدة البيانات:', error);
    return false;
  }
}

// دالة لتنفيذ استعلامات SQL
export async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('خطأ في تنفيذ الاستعلام:', error);
    throw error;
  }
}

export default { pool, query, testConnection };
