
import mysql from 'mysql2/promise';

// إعداد متغيرات الاتصال بقاعدة البيانات
const dbConfig = {
  host: process.env.DB_HOST || 'mysql.hostinger.com',
  user: process.env.DB_USER || 'u632677766_s7s',
  password: process.env.DB_PASSWORD || 'p>O6X[Uzjve&X#Wa',
  database: process.env.DB_NAME || 'u632677766_gaza_aid_plat',
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
