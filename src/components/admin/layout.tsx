
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  BarChart3,
  CircleDollarSign,
  CreditCard,
  FileText,
  LogOut,
  Menu,
  Settings,
  UserCircle,
  Users,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

// تعريف عنصر القائمة
interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [token, setToken] = useState<string | null>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // التحقق من وجود توكن المستخدم
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/admin/login", { replace: true });
    } else {
      setToken(storedToken);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login", { replace: true });
  };

  // قائمة روابط لوحة التحكم
  const navItems: NavItem[] = [
    {
      title: "لوحة التحكم",
      href: "/admin/dashboard",
      icon: <BarChart3 className="ml-2 h-5 w-5" />,
    },
    {
      title: "المشاريع",
      href: "/admin/projects",
      icon: <FileText className="ml-2 h-5 w-5" />,
    },
    {
      title: "المتبرعين",
      href: "/admin/donors",
      icon: <CircleDollarSign className="ml-2 h-5 w-5" />,
    },
    {
      title: "طرق الدفع",
      href: "/admin/payment-methods",
      icon: <CreditCard className="ml-2 h-5 w-5" />,
    },
    {
      title: "الأعضاء",
      href: "/admin/members",
      icon: <Users className="ml-2 h-5 w-5" />,
    },
    {
      title: "إعدادات الموقع",
      href: "/admin/site-settings",
      icon: <Settings className="ml-2 h-5 w-5" />,
    },
    {
      title: "حسابي",
      href: "/admin/account",
      icon: <UserCircle className="ml-2 h-5 w-5" />,
    },
  ];

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
  };

  // إذا لم يكن هناك توكن، لا تعرض أي شيء حتى يتم توجيه المستخدم إلى صفحة تسجيل الدخول
  if (!token) {
    return null;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr]">
      {/* sidebar desktop */}
      {!isMobile && (
        <div className="hidden border-l md:block">
          <AdminSidebar
            navItems={navItems}
            currentPath={location.pathname}
            onLogout={() => setLogoutDialogOpen(true)}
          />
        </div>
      )}

      {/* mobile menu button */}
      {isMobile && (
        <div className="fixed top-4 right-4 z-50">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="bg-background border border-input"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">فتح القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
              <AdminSidebar
                navItems={navItems}
                currentPath={location.pathname}
                onLogout={() => setLogoutDialogOpen(true)}
                onItemClick={() => setMobileMenuOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* main content */}
      <div className="flex flex-col">
        <main className="flex-1">{children}</main>
      </div>

      {/* logout dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تسجيل الخروج</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة التحكم؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              تسجيل الخروج
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface AdminSidebarProps {
  navItems: NavItem[];
  currentPath: string;
  onLogout: () => void;
  onItemClick?: () => void;
}

function AdminSidebar({
  navItems,
  currentPath,
  onLogout,
  onItemClick,
}: AdminSidebarProps) {
  return (
    <ScrollArea className="h-full py-6 pl-4">
      <div className="flex flex-col h-full">
        <div className="mb-8 pr-6">
          <h2 className="text-lg font-semibold">لوحة إدارة منصة دعم غزة</h2>
        </div>
        <nav className="grid gap-2 pr-4">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              onClick={onItemClick}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-base transition-all ${
                currentPath === item.href
                  ? "bg-gaza-primary/10 text-gaza-primary font-medium"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
        <Separator className="my-4" />
        <Button
          onClick={onLogout}
          variant="ghost"
          className="flex items-center gap-2 pr-4 justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="ml-2 h-5 w-5" />
          تسجيل الخروج
        </Button>
        <div className="mt-auto pr-4 py-4 text-xs text-muted-foreground">
          منصة دعم غزة &copy; 2025
        </div>
      </div>
    </ScrollArea>
  );
}
