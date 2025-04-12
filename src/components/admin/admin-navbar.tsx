
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, LayoutDashboard, Package, Users, Settings } from "lucide-react";

export function AdminNavbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Get user data from localStorage
  const userDataString = localStorage.getItem("gaza-admin-user");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  
  const handleLogout = () => {
    localStorage.removeItem("gaza-admin-token");
    localStorage.removeItem("gaza-admin-user");
    navigate("/admin/login");
  };
  
  return (
    <div className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <Link to="/admin/dashboard" className="ml-4 md:ml-0 flex items-center">
            <span className="text-xl font-bold text-gaza-primary">منصة دعم غزة</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center mr-10 space-x-reverse space-x-1">
          <Link
            to="/admin/dashboard"
            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
          >
            <LayoutDashboard size={16} className="ml-2" />
            <span>لوحة القيادة</span>
          </Link>
          <Link
            to="/admin/projects"
            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
          >
            <Package size={16} className="ml-2" />
            <span>المشاريع</span>
          </Link>
          <Link
            to="/admin/donors"
            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
          >
            <Users size={16} className="ml-2" />
            <span>المتبرعون</span>
          </Link>
        </div>
        
        <div className="mr-auto flex items-center space-x-reverse space-x-4">
          <ThemeSwitcher />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="w-8 h-8 rounded-full bg-gaza-primary/10 flex items-center justify-center">
                  <User size={18} className="text-gaza-primary" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium truncate">
                  {userData?.name || "المدير"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {userData?.role === "admin" ? "مدير النظام" : "مستخدم"}
                </p>
              </div>
              <DropdownMenuItem asChild>
                <Link to="/admin/settings" className="cursor-pointer w-full">
                  <Settings size={16} className="ml-2" />
                  <span>الإعدادات</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/" className="cursor-pointer w-full">
                  <LayoutDashboard size={16} className="ml-2" />
                  <span>الواجهة الرئيسية</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut size={16} className="ml-2" />
                <span>تسجيل الخروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="flex flex-col space-y-2 py-4 px-6">
            <Link
              to="/admin/dashboard"
              className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard size={16} className="ml-2" />
              <span>لوحة القيادة</span>
            </Link>
            <Link
              to="/admin/projects"
              className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Package size={16} className="ml-2" />
              <span>المشاريع</span>
            </Link>
            <Link
              to="/admin/donors"
              className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users size={16} className="ml-2" />
              <span>المتبرعون</span>
            </Link>
            <Link
              to="/admin/settings"
              className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings size={16} className="ml-2" />
              <span>الإعدادات</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
