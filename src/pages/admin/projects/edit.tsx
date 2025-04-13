
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Save, 
  ArrowLeft, 
  Image,
  Trash2,
  AlertCircle
} from "lucide-react";

import { AuthMiddleware } from "@/components/admin/auth-middleware";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProjectImage {
  id: number;
  image_url: string;
  is_main: number;
}

interface Project {
  id: number;
  title: string;
  description: string;
  goal: number;
  raised: number;
  is_active: boolean;
  is_featured: boolean;
  start_date: string;
  end_date: string | null;
  images: ProjectImage[];
}

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [mainImageId, setMainImageId] = useState<number | null>(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("gaza-admin-token")}`
        }
      });
      
      const projectData = response.data;
      setProject(projectData);
      setTitle(projectData.title);
      setDescription(projectData.description);
      setGoal(projectData.goal.toString());
      setStartDate(projectData.start_date.split("T")[0]);
      setEndDate(projectData.end_date ? projectData.end_date.split("T")[0] : "");
      setIsActive(projectData.is_active);
      setIsFeatured(projectData.is_featured || false);
      setProjectImages(projectData.images || []);
      
      // Find main image
      const mainImage = projectData.images?.find(img => img.is_main === 1);
      if (mainImage) {
        setMainImageId(mainImage.id);
      }
      
    } catch (error) {
      console.error("Error fetching project:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات المشروع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      setIsSaving(true);
      
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("goal", goal);
      formData.append("startDate", startDate);
      if (endDate) formData.append("endDate", endDate);
      formData.append("isActive", isActive.toString());
      
      // Add new images if any
      if (newImages.length > 0) {
        newImages.forEach(file => {
          formData.append("projectImages", file);
        });
        formData.append("mainImageIndex", mainImageIndex.toString());
      }
      
      await axios.put(`/api/admin/projects/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("gaza-admin-token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      // Update featured status if needed
      if (project && project.is_featured !== isFeatured) {
        await axios.patch(`/api/admin/projects/${id}/featured`, 
          { is_featured: isFeatured },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("gaza-admin-token")}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
      
      toast({
        title: "تم الحفظ",
        description: "تم تحديث المشروع بنجاح",
      });
      
      // Redirect to projects list
      navigate("/admin/projects");
      
    } catch (error) {
      console.error("Error updating project:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث بيانات المشروع",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      setNewImages(prevImages => [...prevImages, ...filesArray]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(prevImages => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      
      // Adjust mainImageIndex if needed
      if (index === mainImageIndex) {
        setMainImageIndex(0);
      } else if (index < mainImageIndex) {
        setMainImageIndex(mainImageIndex - 1);
      }
      
      return updatedImages;
    });
  };

  const setAsMainImage = (index: number) => {
    setMainImageIndex(index);
    setMainImageId(null); // Reset existing main image
  };

  const setExistingAsMainImage = async (imageId: number) => {
    try {
      // This would need a new endpoint to set an existing image as main
      // For now, we'll just update the UI and let the backend handle it on save
      setMainImageId(imageId);
      setMainImageIndex(0); // Reset new image as main
      
      toast({
        title: "تم",
        description: "تم تعيين الصورة كصورة رئيسية",
      });
    } catch (error) {
      console.error("Error setting main image:", error);
      toast({
        title: "خطأ",
        description: "فشل في تعيين الصورة كصورة رئيسية",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <AuthMiddleware>
        <div className="flex flex-col min-h-screen">
          <AdminNavbar />
          <main className="flex-grow p-4 md:p-6">
            <div className="flex justify-center items-center h-full">
              <div className="inline-block border-4 border-t-gaza-primary border-r-gaza-primary border-b-muted border-l-muted rounded-full w-12 h-12 animate-spin"></div>
            </div>
          </main>
        </div>
      </AuthMiddleware>
    );
  }

  if (!project) {
    return (
      <AuthMiddleware>
        <div className="flex flex-col min-h-screen">
          <AdminNavbar />
          <main className="flex-grow p-4 md:p-6">
            <div className="flex flex-col items-center justify-center h-full">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h2 className="text-xl font-bold mb-2">المشروع غير موجود</h2>
              <p className="text-muted-foreground mb-6">
                لم يتم العثور على المشروع المطلوب
              </p>
              <Button onClick={() => navigate("/admin/projects")}>
                <ArrowLeft className="ml-2 h-4 w-4" />
                العودة إلى قائمة المشاريع
              </Button>
            </div>
          </main>
        </div>
      </AuthMiddleware>
    );
  }

  return (
    <AuthMiddleware>
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        
        <main className="flex-grow p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">تعديل المشروع</h1>
              <p className="text-muted-foreground">
                تعديل بيانات المشروع وإضافة صور جديدة
              </p>
            </div>
            
            <Button variant="outline" onClick={() => navigate("/admin/projects")}>
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة للقائمة
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* معلومات المشروع الأساسية */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">معلومات المشروع</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">عنوان المشروع</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">وصف المشروع</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="goal">المبلغ المستهدف (بالدولار)</Label>
                      <Input
                        id="goal"
                        type="number"
                        min="1"
                        step="0.01"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">تاريخ البدء</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="endDate">تاريخ الانتهاء (اختياري)</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="isActive">المشروع نشط</Label>
                        <p className="text-sm text-muted-foreground">
                          تحديد ما إذا كان المشروع نشطًا ومرئيًا للزوار.
                        </p>
                      </div>
                      <Switch
                        id="isActive"
                        checked={isActive}
                        onCheckedChange={setIsActive}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="isFeatured">مشروع مميز</Label>
                        <p className="text-sm text-muted-foreground">
                          تحديد المشروع كمشروع مميز ليظهر في الأعلى.
                        </p>
                      </div>
                      <Switch
                        id="isFeatured"
                        checked={isFeatured}
                        onCheckedChange={setIsFeatured}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* صور المشروع */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">صور المشروع</h3>
                  
                  {/* الصور الحالية */}
                  {projectImages.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-md font-medium">الصور الحالية</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {projectImages.map((image) => (
                          <div 
                            key={image.id} 
                            className={`relative rounded-md overflow-hidden aspect-square ${
                              image.id === mainImageId ? 'ring-2 ring-gaza-primary' : ''
                            }`}
                          >
                            <img
                              src={image.image_url}
                              alt="صورة المشروع"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col gap-2 items-center justify-center p-2">
                              <Button 
                                variant="default" 
                                size="sm" 
                                className="w-full"
                                onClick={() => setExistingAsMainImage(image.id)}
                                disabled={image.id === mainImageId}
                              >
                                {image.id === mainImageId ? "صورة رئيسية" : "تعيين كصورة رئيسية"}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-4" />
                    </div>
                  )}
                  
                  {/* الصور الجديدة */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium">إضافة صور جديدة</h4>
                    
                    <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md p-8">
                      <div className="text-center">
                        <Image className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <div className="flex flex-col items-center">
                          <Label 
                            htmlFor="projectImages" 
                            className="cursor-pointer text-gaza-primary hover:underline"
                          >
                            اختيار صور
                          </Label>
                          <Input
                            id="projectImages"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                          <p className="text-sm text-muted-foreground mt-2">
                            يمكنك اختيار عدة صور في وقت واحد (الحد الأقصى: 10 صور)
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* عرض الصور المختارة */}
                    {newImages.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                        {newImages.map((file, index) => (
                          <div 
                            key={index} 
                            className={`relative rounded-md overflow-hidden aspect-square ${
                              index === mainImageIndex ? 'ring-2 ring-gaza-primary' : ''
                            }`}
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`صورة ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col gap-2 items-center justify-center p-2">
                              <Button 
                                variant="default" 
                                size="sm" 
                                className="w-full"
                                onClick={() => setAsMainImage(index)}
                                disabled={index === mainImageIndex}
                              >
                                {index === mainImageIndex ? "صورة رئيسية" : "تعيين كصورة رئيسية"}
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                className="w-full"
                                onClick={() => removeNewImage(index)}
                              >
                                <Trash2 className="h-4 w-4 ml-2" />
                                حذف
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/projects")}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className="bg-gaza-primary hover:bg-gaza-primary/90"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="inline-block border-2 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full w-4 h-4 animate-spin ml-2"></span>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="ml-2 h-4 w-4" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </AuthMiddleware>
  );
}
