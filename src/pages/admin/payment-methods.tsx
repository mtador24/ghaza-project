
import { useState, useEffect } from "react";
import { AuthMiddleware } from "@/components/admin/auth-middleware";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Plus, Pencil, Trash, CheckCircle, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

// تعريف نوع البيانات لطريقة الدفع
interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  icon: string;
  instructions: string;
  account_number: string;
  is_active: boolean;
}

// مخطط التحقق من صحة النموذج
const formSchema = z.object({
  name: z.string().min(2, { message: "يجب أن يكون الاسم على الأقل حرفين" }),
  description: z.string().optional(),
  icon: z.string().optional(),
  instructions: z.string().optional(),
  account_number: z.string().optional(),
  is_active: z.boolean().default(true),
});

export default function AdminPaymentMethodsPage() {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // إعداد نموذج للإضافة/التعديل
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      instructions: "",
      account_number: "",
      is_active: true,
    },
  });

  // جلب طرق الدفع
  const fetchPaymentMethods = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/payment-methods');
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data);
      } else {
        console.error('فشل في جلب طرق الدفع');
        toast({
          title: "خطأ",
          description: "فشل في جلب طرق الدفع",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('خطأ في جلب طرق الدفع:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الاتصال بالخادم",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  // فتح نافذة الإضافة
  const handleAddNew = () => {
    form.reset({
      name: "",
      description: "",
      icon: "",
      instructions: "",
      account_number: "",
      is_active: true,
    });
    setSelectedMethod(null);
    setIsDialogOpen(true);
  };

  // فتح نافذة التعديل
  const handleEdit = (method: PaymentMethod) => {
    form.reset({
      name: method.name,
      description: method.description,
      icon: method.icon,
      instructions: method.instructions,
      account_number: method.account_number,
      is_active: method.is_active,
    });
    setSelectedMethod(method);
    setIsDialogOpen(true);
  };

  // فتح نافذة الحذف
  const handleDeleteClick = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setIsDeleteDialogOpen(true);
  };

  // تغيير حالة طريقة الدفع (نشط/غير نشط)
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/payment-methods/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        setPaymentMethods(methods => 
          methods.map(method => 
            method.id === id 
              ? { ...method, is_active: !currentStatus } 
              : method
          )
        );
        toast({
          title: "تم التحديث",
          description: "تم تحديث حالة طريقة الدفع بنجاح",
        });
      } else {
        throw new Error('فشل في تحديث الحالة');
      }
    } catch (error) {
      console.error('خطأ في تحديث الحالة:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة طريقة الدفع",
        variant: "destructive",
      });
    }
  };

  // حذف طريقة الدفع
  const handleDelete = async () => {
    if (!selectedMethod) return;
    
    try {
      const response = await fetch(`/api/payment-methods/${selectedMethod.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPaymentMethods(methods => methods.filter(method => method.id !== selectedMethod.id));
        toast({
          title: "تم الحذف",
          description: "تم حذف طريقة الدفع بنجاح",
        });
      } else {
        throw new Error('فشل في حذف طريقة الدفع');
      }
    } catch (error) {
      console.error('خطأ في حذف طريقة الدفع:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف طريقة الدفع",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  // معالجة تقديم النموذج (إضافة/تعديل)
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      let response;
      
      if (selectedMethod) {
        // تحديث طريقة دفع موجودة
        response = await fetch(`/api/payment-methods/${selectedMethod.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
      } else {
        // إضافة طريقة دفع جديدة
        response = await fetch('/api/payment-methods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
      }

      if (!response.ok) {
        throw new Error('فشل في العملية');
      }

      // إعادة تحميل البيانات
      await fetchPaymentMethods();
      
      toast({
        title: selectedMethod ? "تم التحديث" : "تمت الإضافة",
        description: selectedMethod 
          ? "تم تحديث طريقة الدفع بنجاح" 
          : "تمت إضافة طريقة الدفع بنجاح",
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('خطأ:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء العملية. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthMiddleware>
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        
        <main className="flex-grow p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">إدارة وسائل الدفع</h1>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus size={16} />
              <span>إضافة وسيلة دفع</span>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gaza-primary"></div>
            </div>
          ) : (
            <div className="bg-card rounded-lg border shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>رقم الحساب</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentMethods.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        لا توجد وسائل دفع. قم بإضافة وسيلة جديدة.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paymentMethods.map((method) => (
                      <TableRow key={method.id}>
                        <TableCell className="font-medium">{method.name}</TableCell>
                        <TableCell>
                          {method.description ? (
                            method.description.length > 50 
                              ? `${method.description.substring(0, 50)}...` 
                              : method.description
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {method.account_number || <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell>
                          {method.is_active ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 ml-1" />
                              نشط
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle className="w-3 h-3 ml-1" />
                              غير نشط
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleToggleStatus(method.id, method.is_active)}
                            >
                              {method.is_active ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEdit(method)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteClick(method)}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </main>

        {/* نافذة إضافة/تعديل طريقة الدفع */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedMethod ? "تعديل وسيلة الدفع" : "إضافة وسيلة دفع جديدة"}
              </DialogTitle>
              <DialogDescription>
                أدخل تفاصيل وسيلة الدفع أدناه
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: فودافون كاش" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الوصف</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="وصف مختصر لوسيلة الدفع" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تعليمات الدفع</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="تعليمات للمتبرع حول كيفية إتمام عملية الدفع" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="account_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الحساب</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="رقم المحفظة أو الحساب" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none mr-2">
                        <FormLabel>نشط</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          سيظهر للمستخدمين في الواجهة الرئيسية عند تفعيله
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "جاري المعالجة..." : (selectedMethod ? "تحديث" : "إضافة")}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* نافذة تأكيد الحذف */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
              <AlertDialogDescription>
                سيتم حذف وسيلة الدفع "{selectedMethod?.name}" نهائيًا. لا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AuthMiddleware>
  );
}
