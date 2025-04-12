
import { Link } from "react-router-dom";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.svg";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed w-full bg-background/95 backdrop-blur-sm border-b z-50">
      <div className="gaza-container flex items-center justify-between py-3">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="منصة دعم غزة" 
              className="h-10 w-auto"
              onError={(e) => {
                // Fallback if logo image fails to load
                e.currentTarget.outerHTML = '<div class="h-10 w-10 rounded-full bg-gaza-primary text-white flex items-center justify-center font-bold text-xl">غ</div>';
              }}
            />
            <span className="mr-2 text-xl font-bold text-gaza-primary">منصة دعم غزة</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 space-x-reverse">
          <Link to="/" className="px-3 py-2 rounded-md hover:bg-muted transition-colors">
            الرئيسية
          </Link>
          <Link to="/projects" className="px-3 py-2 rounded-md hover:bg-muted transition-colors">
            المشاريع
          </Link>
          <Link to="/about" className="px-3 py-2 rounded-md hover:bg-muted transition-colors">
            عن المنصة
          </Link>
          <Link to="/contact" className="px-3 py-2 rounded-md hover:bg-muted transition-colors">
            اتصل بنا
          </Link>
          <div className="mr-2">
            <ThemeSwitcher />
          </div>
          <Link to="/admin/login">
            <Button variant="outline" className="mr-2">
              دخول الإدارة
            </Button>
          </Link>
          <Button className="bg-gaza-primary hover:bg-gaza-primary/90">
            تبرع الآن
          </Button>
        </nav>

        {/* Mobile Navigation Button */}
        <div className="flex items-center md:hidden space-x-2 space-x-reverse">
          <ThemeSwitcher />
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-foreground">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b animate-fade-in">
          <div className="gaza-container py-3">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link 
                to="/projects" 
                className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                المشاريع
              </Link>
              <Link 
                to="/about" 
                className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                عن المنصة
              </Link>
              <Link 
                to="/contact" 
                className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                اتصل بنا
              </Link>
              <Link 
                to="/admin/login"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="outline" className="w-full">
                  دخول الإدارة
                </Button>
              </Link>
              <Button className="bg-gaza-primary hover:bg-gaza-primary/90 w-full">
                تبرع الآن
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
