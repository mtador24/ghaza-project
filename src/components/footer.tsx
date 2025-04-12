
import { Link } from "react-router-dom";
import { Heart, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted text-muted-foreground mt-20">
      <div className="gaza-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">منصة دعم غزة</h3>
            <p className="mb-4">
              منصة خيرية مخصصة لدعم أهل غزة في وقت الأزمات. نعمل على توصيل المساعدات الإنسانية لمن يحتاجها.
            </p>
            <div className="flex items-center text-gaza-primary">
              <Heart size={18} className="ml-1" />
              <span>معاً لدعم صمود أهلنا في غزة</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">روابط سريعة</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="hover:text-gaza-primary transition-colors">
                الرئيسية
              </Link>
              <Link to="/projects" className="hover:text-gaza-primary transition-colors">
                المشاريع
              </Link>
              <Link to="/about" className="hover:text-gaza-primary transition-colors">
                عن المنصة
              </Link>
              <Link to="/contact" className="hover:text-gaza-primary transition-colors">
                اتصل بنا
              </Link>
              <Link to="/admin/login" className="hover:text-gaza-primary transition-colors">
                دخول الإدارة
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">معلومات الاتصال</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin size={18} className="ml-2 mt-1 text-gaza-primary" />
                <span>فلسطين، غزة، الشارع الرئيسي</span>
              </div>
              <div className="flex items-center">
                <Phone size={18} className="ml-2 text-gaza-primary" />
                <span>+970 59 123 4567</span>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="ml-2 text-gaza-primary" />
                <a href="mailto:info@gaza-aid.org" className="hover:text-gaza-primary transition-colors">
                  info@gaza-aid.org
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center">
          <p>
            جميع الحقوق محفوظة © {currentYear} منصة دعم غزة
          </p>
        </div>
      </div>
    </footer>
  );
}
