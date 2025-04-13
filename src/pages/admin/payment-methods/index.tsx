
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { 
  Wallet, Plus, Pencil, Trash2, Search, Banknote,
  ChevronLeft, ChevronRight, MoreHorizontal, X, Check, Upload
} from "lucide-react";

import { AuthMiddleware } from "@/components/admin/auth-middleware";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

interface PaymentMethod {
  id: number;
  name: string;
  address: string;
  image_url: string;
  created_at: string;
}

export default function AdminPaymentMethodsPage() {
  const navigate = useNavigate();

  // State for payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null);

  // Fetch payment methods
  const fetchPaymentMethods = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("/api/payment-methods", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setPaymentMethods(response.data);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      toast.error("حدث خطأ أثناء جلب طرق الدفع");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setAddress("");
    setImageFile(null);
    setImagePreview(null);
    setEditingPaymentMethod(null);
  };

  // Add payment method
  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !address || !imageFile) {
      toast.error("يرجى ملء جميع الحقول وتحميل صورة");
      return;
    }
    
    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("address", address);
      formData.append("image", imageFile);
      
      await axios.post("/api/admin/payment-methods", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      
      toast.success("تم إضافة طريقة الدفع بنجاح");
      setIsAddDialogOpen(false);
      resetForm();
      fetchPaymentMethods();
    } catch (error) {
      console.error("Error adding payment method:", error);
      toast.error("حدث خطأ أثناء إضافة طريقة الدفع");
    }
  };

  // Start editing payment method
  const handleStartEdit = (paymentMethod: PaymentMethod) => {
    setEditingPaymentMethod(paymentMethod);
    setName(paymentMethod.name);
    setAddress(paymentMethod.address);
    setImagePreview(paymentMethod.image_url);
    setIsEditDialogOpen(true);
  };

  // Update payment method
  const handleUpdatePaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPaymentMethod || !name || !address) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }
    
    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("address", address);
      
      if (imageFile) {
        formData.append("image", imageFile);
      }
      
      await axios.put(`/api/admin/payment-methods/${editingPaymentMethod.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      
      toast.success("تم تحديث طريقة الدفع بنجاح");
      setIsEditDialogOpen(false);
      resetForm();
      fetchPaymentMethods();
    } catch (error) {
      console.error("Error updating payment method:", error);
      toast.error("حدث خطأ أثناء تحديث طريقة الدفع");
    }
  };

  // Delete payment method
  const handleDeletePaymentMethod = async () => {
    if (!deleteConfirmId) return;
    
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`/api/admin/payment-methods/${deleteConfirmId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success("تم حذف طريقة الدفع بنجاح");
      setDeleteConfirmId(null);
      fetchPaymentMethods();
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast.error("حدث خطأ أثناء حذف طريقة الدفع");
    }
  };

  return (
    <AuthMiddleware>
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        
        <main className="flex-grow p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">طرق الدفع</h1>
              <p className="text-muted-foreground">
                إدارة طرق الدفع المتاحة للتبرعات
              </p>
            </div>
            
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              إضافة طريقة دفع
            </Button>
          </div>
          
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/50 p-4">
              <CardTitle className="text-lg">قائمة طرق الدفع</CardTitle>
              <CardDescription>
                عرض وتعديل طرق الدفع المتاحة للمتبرعين
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : paymentMethods.length === 0 ? (
                <div className="text-center py-12">
                  <Wallet className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">لا توجد طرق دفع</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    قم بإضافة طرق الدفع ليتمكن المتبرعون من رؤيتها
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    إضافة طريقة دفع
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الصورة</TableHead>
                      <TableHead>الاسم</TableHead>
                      <TableHead>عنوان المحفظة</TableHead>
                      <TableHead className="w-[100px] text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentMethods.map((paymentMethod) => (
                      <TableRow key={paymentMethod.id}>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <img 
                              src={paymentMethod.image_url} 
                              alt={paymentMethod.name}
                              className="h-10 w-10 object-contain rounded-md"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{paymentMethod.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="truncate max-w-[250px] text-sm">
                              {paymentMethod.address}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">فتح القائمة</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStartEdit(paymentMethod)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                تعديل
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteConfirmId(paymentMethod.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
        
        {/* إضافة طريقة دفع جديدة */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>إضافة طريقة دفع جديدة</DialogTitle>
              <DialogDescription>
                أدخل بيانات طريقة الدفع وشعارها
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddPaymentMethod}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">اسم طريقة الدفع</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: فودافون كاش"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="address">عنوان المحفظة</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="أدخل رقم الهاتف أو عنوان المحفظة"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="image">شعار طريقة الدفع</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image-upload")?.click()}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {imageFile ? "تغيير الصورة" : "اختيار صورة"}
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      required
                    />
                  </div>
                  
                  {imagePreview && (
                    <div className="mt-2 relative w-24 h-24 mx-auto border rounded-md overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="معاينة"
                        className="w-full h-full object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">إضافة طريقة الدفع</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* تعديل طريقة دفع */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>تعديل طريقة الدفع</DialogTitle>
              <DialogDescription>
                تعديل بيانات طريقة الدفع وشعارها
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleUpdatePaymentMethod}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">اسم طريقة الدفع</Label>
                  <Input
                    id="edit-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: فودافون كاش"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-address">عنوان المحفظة</Label>
                  <Input
                    id="edit-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="أدخل رقم الهاتف أو عنوان المحفظة"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-image">شعار طريقة الدفع</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("edit-image-upload")?.click()}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {imageFile ? "تغيير الصورة" : "تغيير الصورة (اختياري)"}
                    </Button>
                    <input
                      id="edit-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  
                  {imagePreview && (
                    <div className="mt-2 relative w-24 h-24 mx-auto border rounded-md overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="معاينة"
                        className="w-full h-full object-contain"
                      />
                      {imageFile && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => {
                            setImageFile(null);
                            // Reset to original image if editing
                            if (editingPaymentMethod) {
                              setImagePreview(editingPaymentMethod.image_url);
                            } else {
                              setImagePreview(null);
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">حفظ التغييرات</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* تأكيد الحذف */}
        <Dialog 
          open={deleteConfirmId !== null} 
          onOpenChange={(open) => !open && setDeleteConfirmId(null)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>تأكيد حذف طريقة الدفع</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من حذف طريقة الدفع هذه؟ هذا الإجراء لا يمكن التراجع عنه.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
              >
                إلغاء
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeletePaymentMethod}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                تأكيد الحذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthMiddleware>
  );
}
