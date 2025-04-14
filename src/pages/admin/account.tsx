
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AuthMiddleware } from "@/components/admin/auth-middleware";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAdminProfile, updateAdminProfile } from "@/api/adminApi";

type ProfileFormValues = {
  name: string;
  email: string;
};

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function AdminAccountPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileFormValues | null>(null);
  
  const profileForm = useForm<ProfileFormValues>({
    defaultValues: {
      name: "",
      email: "",
    }
  });
  
  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
  });
  
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const data = await getAdminProfile();
        if (data) {
          setProfile(data);
          profileForm.reset({
            name: data.name,
            email: data.email,
          });
        }
      } catch (error) {
        toast.error("حدث خطأ أثناء تحميل بيانات الحساب");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  const onUpdateProfile = async (data: ProfileFormValues) => {
    try {
      await updateAdminProfile(data);
      toast.success("تم تحديث بيانات الحساب بنجاح");
      localStorage.setItem("adminName", data.name);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "حدث خطأ أثناء تحديث بيانات الحساب");
    }
  };
  
  const onUpdatePassword = async (data: PasswordFormValues) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("كلمة المرور الجديدة وتأكيدها غير متطابقين");
      return;
    }
    
    try {
      await updateAdminProfile({
        name: profile?.name || "",
        email: profile?.email || "",
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      toast.success("تم تحديث كلمة المرور بنجاح");
      passwordForm.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "حدث خطأ أثناء تحديث كلمة المرور");
    }
  };
  
  return (
    <AuthMiddleware>
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        
        <main className="flex-grow p-4 md:p-6">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 text-2xl font-bold">إعدادات الحساب</h1>
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="border-4 border-t-gaza-primary border-r-gaza-primary border-b-muted border-l-muted rounded-full w-12 h-12 animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>المعلومات الشخصية</CardTitle>
                    <CardDescription>
                      قم بتعديل معلوماتك الشخصية هنا
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">الاسم</Label>
                        <Input
                          id="name"
                          {...profileForm.register("name")}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                          id="email"
                          type="email"
                          {...profileForm.register("email")}
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full md:w-auto">
                        حفظ التغييرات
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                
                {/* Password Update */}
                <Card>
                  <CardHeader>
                    <CardTitle>تغيير كلمة المرور</CardTitle>
                    <CardDescription>
                      قم بتحديث كلمة المرور الخاصة بك بانتظام للحفاظ على أمان حسابك
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={passwordForm.handleSubmit(onUpdatePassword)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          {...passwordForm.register("currentPassword")}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          {...passwordForm.register("newPassword")}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          {...passwordForm.register("confirmPassword")}
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full md:w-auto">
                        تغيير كلمة المرور
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthMiddleware>
  );
}
