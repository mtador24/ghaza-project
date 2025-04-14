
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Heart, Facebook, Twitter, Instagram, MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { contactSettings, socialSettings, getValue, loading } = useSiteSettings();

  // الحصول على اسم المؤسسة من الإعدادات العامة
  const organizationName = getValue('organization_name') || 'منصة دعم غزة';

  // رسم أيقونة مناسبة لكل وسيلة تواصل اجتماعي
  const getSocialIcon = (key: string) => {
    switch (key) {
      case 'facebook': return <Facebook size={18} className="ml-2" />;
      case 'twitter': return <Twitter size={18} className="ml-2" />;
      case 'instagram': return <Instagram size={18} className="ml-2" />;
      default: return null;
    }
  };

  return (
    <footer className="bg-muted text-muted-foreground mt-20">
      <div className="gaza-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">{organizationName}</h3>
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
              {/* عرض معلومات الاتصال من قاعدة البيانات */}
              {loading ? (
                <p>جاري تحميل البيانات...</p>
              ) : (
                <>
                  {contactSettings.map((setting) => (
                    <ContactItem 
                      key={setting.id} 
                      type={setting.setting_key} 
                      value={setting.setting_value || ''} 
                    />
                  ))}
                </>
              )}
            </div>

            {/* عرض وسائل التواصل الاجتماعي */}
            {socialSettings.length > 0 && (
              <div className="mt-4">
                <h4 className="text-base font-medium text-foreground mb-2">تابعنا على</h4>
                <div className="flex space-x-3 space-x-reverse">
                  {socialSettings.map((social) => (
                    <a 
                      key={social.id}
                      href={social.setting_value || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-gaza-primary transition-colors"
                    >
                      {getSocialIcon(social.setting_key)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center">
          <p>
            جميع الحقوق محفوظة © {currentYear} {organizationName}
          </p>
        </div>
      </div>
    </footer>
  );
}

type ContactItemProps = {
  type: string;
  value: string;
};

function ContactItem({ type, value }: ContactItemProps) {
  let icon;
  let isLink = false;
  let href = '';

  switch (type) {
    case 'email':
      icon = <Mail size={18} className="ml-2 text-gaza-primary" />;
      isLink = true;
      href = `mailto:${value}`;
      break;
    case 'phone':
      icon = <Phone size={18} className="ml-2 text-gaza-primary" />;
      isLink = true;
      href = `tel:${value}`;
      break;
    case 'whatsapp':
      icon = <MessageCircle size={18} className="ml-2 text-gaza-primary" />;
      isLink = true;
      href = `https://wa.me/${value.replace(/[^0-9]/g, '')}`;
      break;
    case 'address':
      icon = <MapPin size={18} className="ml-2 mt-1 text-gaza-primary" />;
      break;
    default:
      icon = null;
  }

  return (
    <div className="flex items-start">
      {icon}
      {isLink ? (
        <a href={href} className="hover:text-gaza-primary transition-colors">
          {value}
        </a>
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
}
