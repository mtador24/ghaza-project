
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProjectCard } from "@/components/project-card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { getProjects } from "@/api/projectsApi";
import { useToast } from "@/hooks/use-toast";

export default function ProjectsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); 
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل المشاريع، يرجى المحاولة مرة أخرى",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, [toast]);
  
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && project.is_active;
    if (filter === "completed") return matchesSearch && !project.is_active;
    
    return matchesSearch;
  });
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="gaza-container">
          {/* Page Header */}
          <div className="py-8 text-center">
            <h1 className="text-3xl font-bold mb-4">مشاريع دعم غزة</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              استعرض المشاريع المتاحة للتبرع ودعم أهلنا في غزة. كل تبرع يساهم في تخفيف المعاناة وتوفير الاحتياجات الأساسية.
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder="ابحث عن مشروع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="تصفية المشاريع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المشاريع</SelectItem>
                  <SelectItem value="active">المشاريع النشطة</SelectItem>
                  <SelectItem value="completed">المشاريع المكتملة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Projects Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block border-4 border-t-gaza-primary border-r-gaza-primary border-b-muted border-l-muted rounded-full w-12 h-12 animate-spin"></div>
              <p className="mt-4 text-lg">جاري تحميل المشاريع...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-2">لا توجد مشاريع مطابقة</h2>
              <p className="text-muted-foreground">
                حاول تغيير معايير البحث أو التصفية
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
