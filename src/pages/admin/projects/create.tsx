
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Calendar as CalendarIcon, ImagePlus, X, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

import { AuthMiddleware } from "@/components/admin/auth-middleware";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

// Project form schema validation
const projectFormSchema = z.object({
  title: z.string().min(3, { message: "عنوان المشروع يجب أن يكون 3 أحرف على الأقل" }),
  description: z.string().min(10, { message: "الوصف يجب أن يكون 10 أحرف على الأقل" }),
  goal: z.coerce.number().positive({ message: "الهدف يجب أن يكون رقماً موجباً" }),
  startDate: z.date({ required_error: "يرجى تحديد تاريخ البدء" }),
  endDate: z.date().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with default values
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      goal: 0,
      startDate: new Date(),
    },
  });
  
  // Handle image selection
  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);
      setSelectedImages(prev => [...prev, ...newImages]);
    }
  };
  
  // Remove image at specific index
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    if (mainImageIndex === index) {
      setMainImageIndex(0);
    } else if (mainImageIndex > index) {
      setMainImageIndex(prev => prev - 1);
    }
  };
  
  // Set main image
  const setAsMainImage = (index: number) => {
    setMainImageIndex(index);
  };
  
  // Submit form handler
  const onSubmit = async (data: ProjectFormValues) => {
    if (selectedImages.length === 0) {
      toast({
        title: "خطأ",
        description: "يرجى إضافة صورة واحدة على الأقل للمشروع",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get current user from localStorage
      const userDataString = localStorage.getItem("gaza-admin-user");
      const userData = userDataString ? JSON.parse(userDataString) : null;
      
      // Create FormData instance to handle file uploads
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("goal", data.goal.toString());
      formData.append("startDate", data.startDate.toISOString().split('T')[0]);
      if (data.endDate) {
        formData.append("endDate", data.endDate.toISOString().split('T')[0]);
      }
      formData.append("userId", userData?.id || "1");
      formData.append("mainImageIndex", mainImageIndex.toString());
      
      // Append all selected images
      selectedImages.forEach((image, index) => {
        formData.append("projectImages", image);
      });
      
      // Send project data to server
      const response = await axios.post("/api/admin/projects", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("gaza-admin-token")}`,
        },
      });
      
      toast({
        title: "تم إنشاء المشروع",
        description: "تم إنشاء المشروع بنجاح",
      });
      
      // Redirect to projects list
      navigate("/admin/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء المشروع، يرجى المحاولة مرة أخرى",
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
          <div className="mb-6">
            <Button 
              variant="outline" 
              className="mb-4" 
              onClick={() => navigate("/admin/projects")}
            >
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة إلى المشاريع
            </Button>
            
            <h1 className="text-2xl font-bold">إضافة مشروع جديد</h1>
            <p className="text-muted-foreground">
              أضف مشروعاً جديداً إلى قائمة المشاريع مع الصور والتفاصيل
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>بيانات المشروع</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>عنوان المشروع</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل عنوان المشروع" {...field} />
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
                            <FormLabel>وصف المشروع</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="أدخل وصفاً تفصيلياً للمشروع" 
                                className="min-h-32" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="goal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>المبلغ المستهدف ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                placeholder="أدخل المبلغ المستهدف" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>تاريخ البدء</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-start text-right"
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP", { locale: ar })
                                      ) : (
                                        <span>اختر تاريخ البدء</span>
                                      )}
                                      <CalendarIcon className="mr-auto h-4 w-4" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>تاريخ الانتهاء (اختياري)</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-start text-right"
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP", { locale: ar })
                                      ) : (
                                        <span>اختر تاريخ الانتهاء</span>
                                      )}
                                      <CalendarIcon className="mr-auto h-4 w-4" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value || undefined}
                                    onSelect={field.onChange}
                                    initialFocus
                                    disabled={(date) => date < form.getValues("startDate")}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-gaza-primary hover:bg-gaza-primary/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "جاري الإنشاء..." : "إنشاء المشروع"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            {/* Project Images */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>صور المشروع</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        id="project-images"
                        className="hidden"
                        onChange={handleImageSelection}
                      />
                      <label 
                        htmlFor="project-images" 
                        className="block cursor-pointer"
                      >
                        <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          اضغط لإضافة صور المشروع
                        </p>
                        <p className="text-xs text-muted-foreground">
                          يمكنك اختيار أكثر من صورة
                        </p>
                      </label>
                    </div>
                    
                    <Separator />
                    
                    {selectedImages.length > 0 ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium">
                          الصور المختارة ({selectedImages.length})
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedImages.map((image, index) => (
                            <div 
                              key={index} 
                              className={`relative group rounded-md overflow-hidden border-2 ${
                                index === mainImageIndex ? "border-gaza-primary" : "border-transparent"
                              }`}
                            >
                              <img 
                                src={URL.createObjectURL(image)} 
                                alt={`صورة المشروع ${index + 1}`}
                                className="w-full h-24 object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="flex space-x-1 space-x-reverse">
                                  {index !== mainImageIndex && (
                                    <Button 
                                      size="sm"
                                      variant="secondary"
                                      className="h-8 w-8 p-0"
                                      onClick={() => setAsMainImage(index)}
                                    >
                                      <span className="sr-only">تعيين كصورة رئيسية</span>
                                      <span className="text-xs">رئيسية</span>
                                    </Button>
                                  )}
                                  <Button 
                                    size="sm"
                                    variant="destructive"
                                    className="h-8 w-8 p-0"
                                    onClick={() => removeImage(index)}
                                  >
                                    <span className="sr-only">حذف الصورة</span>
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              {index === mainImageIndex && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gaza-primary text-white text-[10px] text-center py-0.5">
                                  صورة رئيسية
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        لم يتم اختيار أي صور بعد
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthMiddleware>
  );
}
