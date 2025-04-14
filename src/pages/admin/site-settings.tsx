
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/admin/dashboard/loading-spinner";
import { Facebook, Globe, Instagram, Mail, MapPin, MessageCircle, Phone, Plus, Save, Trash2, Twitter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SiteSettingType, addSetting, deleteSetting, getAllSettings, toggleSettingStatus, updateSetting } from "@/api/siteSettingsApi";
import { Separator } from "@/components/ui/separator";

type CategoryType = 'contact' | 'social' | 'general';

export default function SiteSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSetting, setNewSetting] = useState({
    key: '',
    value: '',
    category: 'general' as CategoryType,
    label: '',
    icon: '',
  });
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await getAllSettings();
      setSettings(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ أثناء جلب البيانات. الرجاء المحاولة مرة أخرى.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdateSetting = async (key: string, value: string) => {
    try {
      await updateSetting(key, value);
      toast({
        title: "تم التحديث",
        description: "تم تحديث الإعداد بنجاح",
      });
      fetchSettings();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل تحديث الإعداد. الرجاء المحاولة مرة أخرى.",
      });
    }
  };

  const handleToggleStatus = async (key: string, isActive: boolean) => {
    try {
      await toggleSettingStatus(key, isActive);
      toast({
        title: "تم التحديث",
        description: `تم ${isActive ? 'تفعيل' : 'تعطيل'} الإعداد بنجاح`,
      });
      fetchSettings();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل تحديث حالة الإعداد. الرجاء المحاولة مرة أخرى.",
      });
    }
  };

  const handleAddSetting = async () => {
    try {
      await addSetting(newSetting);
      toast({
        title: "تم الإضافة",
        description: "تم إضافة الإعداد الجديد بنجاح",
      });
      setOpenAddDialog(false);
      setNewSetting({
        key: '',
        value: '',
        category: 'general',
        label: '',
        icon: '',
      });
      fetchSettings();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل إضافة الإعداد. الرجاء المحاولة مرة أخرى.",
      });
    }
  };

  const handleDeleteSetting = async (key: string) => {
    try {
      await deleteSetting(key);
      toast({
        title: "تم الحذف",
        description: "تم حذف الإعداد بنجاح",
      });
      fetchSettings();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل حذف الإعداد. الرجاء المحاولة مرة أخرى.",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  // تصفية الإعدادات حسب الفئة
  const contactSettings = settings.filter(s => s.category === 'contact');
  const socialSettings = settings.filter(s => s.category === 'social');
  const generalSettings = settings.filter(s => s.category === 'general');

  // عرض أيقونة مناسبة لكل إعداد
  const getIcon = (iconName: string | null) => {
    switch (iconName) {
      case 'mail': return <Mail className="h-5 w-5" />;
      case 'phone': return <Phone className="h-5 w-5" />;
      case 'messageCircle': return <MessageCircle className="h-5 w-5" />;
      case 'mapPin': return <MapPin className="h-5 w-5" />;
      case 'facebook': return <Facebook className="h-5 w-5" />;
      case 'twitter': return <Twitter className="h-5 w-5" />;
      case 'instagram': return <Instagram className="h-5 w-5" />;
      case 'globe': return <Globe className="h-5 w-5" />;
      default: return <Globe className="h-5 w-5" />;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">إعدادات الموقع</h1>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gaza-primary hover:bg-gaza-primary/90">
                <Plus className="ml-2 h-4 w-4" /> إضافة إعداد جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>إضافة إعداد جديد</DialogTitle>
                <DialogDescription>
                  أدخل تفاصيل الإعداد الجديد هنا. اضغط حفظ عند الانتهاء.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="key" className="text-right">
                    المفتاح
                  </Label>
                  <Input
                    id="key"
                    value={newSetting.key}
                    onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    القيمة
                  </Label>
                  <Input
                    id="value"
                    value={newSetting.value}
                    onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="label" className="text-right">
                    التسمية
                  </Label>
                  <Input
                    id="label"
                    value={newSetting.label}
                    onChange={(e) => setNewSetting({ ...newSetting, label: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    الفئة
                  </Label>
                  <select
                    id="category"
                    value={newSetting.category}
                    onChange={(e) => setNewSetting({ ...newSetting, category: e.target.value as CategoryType })}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="contact">معلومات الاتصال</option>
                    <option value="social">وسائل التواصل الاجتماعي</option>
                    <option value="general">إعدادات عامة</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="icon" className="text-right">
                    الأيقونة
                  </Label>
                  <Input
                    id="icon"
                    value={newSetting.icon}
                    onChange={(e) => setNewSetting({ ...newSetting, icon: e.target.value })}
                    placeholder="mail, phone, facebook, etc."
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleAddSetting} 
                  className="bg-gaza-primary hover:bg-gaza-primary/90"
                >
                  <Save className="ml-2 h-4 w-4" /> حفظ
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="contact">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="contact">معلومات الاتصال</TabsTrigger>
            <TabsTrigger value="social">وسائل التواصل الاجتماعي</TabsTrigger>
            <TabsTrigger value="general">إعدادات عامة</TabsTrigger>
          </TabsList>

          <SettingsTabContent 
            settings={contactSettings} 
            title="معلومات الاتصال" 
            description="إدارة بيانات الاتصال التي تظهر في موقعك" 
            value="contact"
            getIcon={getIcon}
            onUpdate={handleUpdateSetting}
            onToggle={handleToggleStatus}
            onDelete={handleDeleteSetting}
          />

          <SettingsTabContent 
            settings={socialSettings} 
            title="وسائل التواصل الاجتماعي" 
            description="إدارة روابط وسائل التواصل الاجتماعي" 
            value="social"
            getIcon={getIcon}
            onUpdate={handleUpdateSetting}
            onToggle={handleToggleStatus}
            onDelete={handleDeleteSetting}
          />

          <SettingsTabContent 
            settings={generalSettings} 
            title="إعدادات عامة" 
            description="إدارة الإعدادات العامة للموقع" 
            value="general"
            getIcon={getIcon}
            onUpdate={handleUpdateSetting}
            onToggle={handleToggleStatus}
            onDelete={handleDeleteSetting}
          />
        </Tabs>
      </div>
    </AdminLayout>
  );
}

type SettingsTabContentProps = {
  settings: SiteSettingType[];
  title: string;
  description: string;
  value: string;
  getIcon: (iconName: string | null) => JSX.Element;
  onUpdate: (key: string, value: string) => Promise<void>;
  onToggle: (key: string, isActive: boolean) => Promise<void>;
  onDelete: (key: string) => Promise<void>;
};

function SettingsTabContent({ 
  settings, 
  title, 
  description, 
  value,
  getIcon,
  onUpdate,
  onToggle,
  onDelete
}: SettingsTabContentProps) {
  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {settings.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              لا توجد إعدادات في هذه الفئة
            </div>
          ) : (
            <div className="space-y-6">
              {settings.map((setting) => (
                <div key={setting.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getIcon(setting.icon)}
                      <span className="font-medium">{setting.label}</span>
                      <Badge variant={setting.is_active ? "default" : "outline"}>
                        {setting.is_active ? "مفعل" : "معطل"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={setting.is_active}
                        onCheckedChange={(checked) => onToggle(setting.setting_key, checked)}
                      />
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
                            <AlertDialogDescription>
                              سيتم حذف هذا الإعداد بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(setting.setting_key)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <Input
                        defaultValue={setting.setting_value || ''}
                        id={`setting-${setting.setting_key}`}
                        onBlur={(e) => {
                          if (e.target.value !== setting.setting_value) {
                            onUpdate(setting.setting_key, e.target.value);
                          }
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      key: {setting.setting_key}
                    </div>
                  </div>
                  <Separator className="my-4" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
