
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Project } from "@/data/mockData";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { PaymentMethods } from "@/components/payment-methods";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const percentRaised = Math.min(Math.round((project.raised / project.goal) * 100), 100);
  const formattedRaised = project.raised.toLocaleString('ar-EG');
  const formattedGoal = project.goal.toLocaleString('ar-EG');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // جلب طرق الدفع عند فتح اللوحة الجانبية
  const handleOpenSheet = async () => {
    try {
      const response = await fetch('/api/payment-methods?active=true');
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data);
      } else {
        console.error('فشل في جلب طرق الدفع');
      }
    } catch (error) {
      console.error('خطأ في جلب طرق الدفع:', error);
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={project.images[0]?.url || "https://images.unsplash.com/photo-1469571486292-b5051fe9f386"} 
          alt={project.images[0]?.alt || project.title}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
        {project.isActive && (
          <div className="absolute top-2 left-2 bg-gaza-primary text-white text-xs px-2 py-1 rounded-full">
            مشروع نشط
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{project.title}</CardTitle>
        <CardDescription>{project.shortDescription}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-1">
            <span>تم جمع: {formattedRaised} $</span>
            <span>الهدف: {formattedGoal} $</span>
          </div>
          <Progress value={percentRaised} className="h-2" />
          <div className="text-sm text-muted-foreground text-left">
            {percentRaised}%
          </div>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>عدد المتبرعين: {project.donors.length}</p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" asChild>
          <Link to={`/projects/${project.id}`}>تفاصيل المشروع</Link>
        </Button>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button 
              className="bg-gaza-primary hover:bg-gaza-primary/90"
              onClick={handleOpenSheet}
            >
              تبرع الآن
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] sm:max-w-none">
            <SheetHeader className="text-right">
              <SheetTitle>اختر وسيلة التبرع</SheetTitle>
              <SheetDescription>
                تبرعك يساهم في دعم أهلنا في غزة
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto max-h-[calc(80vh-120px)] p-4">
              {paymentMethods.length > 0 ? (
                <PaymentMethods methods={paymentMethods} projectId={project.id} />
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">جاري تحميل وسائل الدفع...</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </CardFooter>
    </Card>
  );
}
