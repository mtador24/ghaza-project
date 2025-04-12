
-- إضافة جدول طرق الدفع
CREATE TABLE IF NOT EXISTS payment_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  icon VARCHAR(255), -- مسار الأيقونة
  instructions TEXT, -- تعليمات الدفع
  account_number VARCHAR(100), -- رقم الحساب أو المحفظة
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إضافة حقل جديد في جدول التبرعات
ALTER TABLE donations ADD COLUMN IF NOT EXISTS payment_method_id INT;
ALTER TABLE donations ADD CONSTRAINT fk_payment_method FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id);
