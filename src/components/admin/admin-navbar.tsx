import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Home, 
  LayoutDashboard, 
  Users, 
  Settings, 
  Power,
  CreditCard
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const linkClasses = (isActive: boolean) =>
  `flex items-center gap-2 px-4 py-2 rounded-md transition-colors hover:bg-secondary 
  ${isActive ? 'bg-secondary font-semibold' : 'text-muted-foreground'}`;

export function AdminNavbar() {
  const { user, logout } = useAuth();
  
  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-4">
          <LayoutDashboard className="w-6 h-6" />
          <span className="font-bold text-lg">لوحة التحكم</span>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>حسابي</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" disabled>
                <Settings className="w-4 h-4 ml-2" />
                <span>الإعدادات</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                <Power className="w-4 h-4 ml-2" />
                <span>تسجيل الخروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-start items-start md:items-center gap-2 px-4 py-2 overflow-x-auto">
        <NavLink to="/admin/dashboard" className={({ isActive }) => linkClasses(isActive)}>
          <Home className="w-5 h-5 ml-2" />
          <span>الرئيسية</span>
        </NavLink>
        
        <NavLink to="/admin/projects" className={({ isActive }) => linkClasses(isActive)}>
          <LayoutDashboard className="w-5 h-5 ml-2" />
          <span>المشاريع</span>
        </NavLink>
        
        <NavLink to="/admin/donors" className={({ isActive }) => linkClasses(isActive)}>
          <Users className="w-5 h-5 ml-2" />
          <span>المتبرعين</span>
        </NavLink>

        <NavLink to="/admin/payment-methods" className={({ isActive }) => linkClasses(isActive)}>
          <CreditCard className="w-5 h-5 ml-2" />
          <span>وسائل الدفع</span>
        </NavLink>
      </div>
    </nav>
  );
}
