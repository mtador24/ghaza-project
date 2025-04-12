
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProjectSlider } from "@/components/project-slider";
import { DonorsList } from "@/components/donors-list";
import { DonationProgress } from "@/components/donation-progress";
import { mockProjects, Project } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar } from "lucide-react";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate API fetch with a timeout
    const timer = setTimeout(() => {
      const foundProject = mockProjects.find(p => p.id === Number(id));
      
      if (foundProject) {
        setProject(foundProject);
        setLoading(false);
      } else {
        setError("المشروع غير موجود");
        setLoading(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="inline-block border-4 border-t-gaza-primary border-r-gaza-primary border-b-muted border-l-muted rounded-full w-12 h-12 animate-spin"></div>
            <p className="mt-4 text-lg">جاري تحميل بيانات المشروع...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !project) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-20">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">خطأ</h2>
              <p className="mb-6">{error || "حدث خطأ أثناء تحميل بيانات المشروع"}</p>
              <Button asChild>
                <Link to="/projects">العودة إلى المشاريع</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="gaza-container py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">الرئيسية</Link>
            <span className="mx-2">/</span>
            <Link to="/projects" className="hover:text-foreground transition-colors">المشاريع</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{project.title}</span>
          </nav>
          
          {/* Project Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">{project.title}</h1>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Calendar size={16} className="ml-1" />
              <span>تاريخ البدء: {new Date(project.startDate).toLocaleDateString('ar-EG')}</span>
              <span className="mx-2">•</span>
              <span>تاريخ الانتهاء: {new Date(project.endDate).toLocaleDateString('ar-EG')}</span>
            </div>
          </div>
          
          {/* Project Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Project Images */}
              <ProjectSlider images={project.images} />
              
              {/* Project Description */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">وصف المشروع</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{project.description}</p>
                </CardContent>
              </Card>
              
              {/* Call to Action */}
              <div className="bg-muted p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-3">ساهم في دعم المشروع</h2>
                <p className="mb-4">
                  تبرعك سيساهم في مساعدة أهلنا في غزة وتوفير احتياجاتهم الأساسية.
                </p>
                <Button size="lg" className="bg-gaza-primary hover:bg-gaza-primary/90">
                  تبرع الآن
                </Button>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Donation Progress */}
              <DonationProgress
                raised={project.raised}
                goal={project.goal}
              />
              
              {/* Donors List */}
              <DonorsList donors={project.donors} />
              
              {/* Back to Projects */}
              <div className="text-center">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/projects" className="flex items-center justify-center">
                    <ArrowRight className="ml-2" size={16} />
                    <span>العودة إلى المشاريع</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
