import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProjectCard } from "@/components/project-card";
import { ProjectSlider, SliderImage } from "@/components/project-slider";
import { DonorsList } from "@/components/donors-list";
import { getProjects, getLatestDonations, getDonationStats } from "@/api/projectsApi";
import { Heart, ArrowLeft } from "lucide-react";

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [recentDonors, setRecentDonors] = useState([]);
  const [stats, setStats] = useState({ totalDonations: 0, totalDonors: 0, activeProjects: 0 });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [projectsData, donorsData, statsData] = await Promise.all([
          getProjects(),
          getLatestDonations(5),
          getDonationStats()
        ]);
        
        setProjects(projectsData);
        
        // Transform donors data
        const transformedDonors = donorsData.map(donor => ({
          id: donor.id,
          name: donor.donor_name,
          amount: donor.amount,
          date: donor.donation_date,
          message: donor.notes || null
        }));
        
        setRecentDonors(transformedDonors);
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Filter active projects
  const activeProjects = projects.filter(project => project.is_active);
  const featuredProject = activeProjects.length > 0 ? activeProjects[0] : null;
  
  // Transform featured project for components
  const featuredProjectImages: SliderImage[] = featuredProject ? 
    [{ 
      id: 1, 
      projectId: featuredProject.id,
      url: featuredProject.main_image, 
      alt: featuredProject.title 
    }] : [];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="bg-gaza-primary text-white py-14 md:py-20">
          <div className="gaza-container">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  معاً لدعم صمود أهلنا في غزة
                </h1>
                <p className="text-lg mb-6">
                  تبرعك اليوم يمكن أن يغير حياة العائلات المتضررة في غزة. ساهم في توفير الاحتياجات الأساسية للحياة.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-white text-gaza-primary hover:bg-white/90">
                    تبرع الآن
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                    <Link to="/projects">
                      استعرض المشاريع
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 md:pr-6">
                <div className="bg-white p-6 rounded-lg shadow-lg text-gaza-primary">
                  <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold">إجمالي التبرعات</h2>
                    <p className="text-3xl md:text-4xl font-bold mt-2">
                      {stats.totalDonations.toLocaleString('ar-EG')} $
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-muted rounded-lg p-3">
                      <h3 className="font-medium text-foreground">عدد المشاريع</h3>
                      <p className="text-xl font-bold">{stats.activeProjects}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <h3 className="font-medium text-foreground">عدد المتبرعين</h3>
                      <p className="text-xl font-bold">{stats.totalDonors}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Project Section */}
        {loading ? (
          <section className="py-12 text-center">
            <div className="inline-block border-4 border-t-gaza-primary border-r-gaza-primary border-b-muted border-l-muted rounded-full w-12 h-12 animate-spin"></div>
            <p className="mt-4 text-lg">جاري تحميل البيانات...</p>
          </section>
        ) : featuredProject ? (
          <section className="py-12 md:py-16">
            <div className="gaza-container">
              <div className="flex items-center mb-8">
                <Heart className="text-gaza-primary ml-2" size={24} />
                <h2 className="text-2xl md:text-3xl font-bold">مشروع مميز</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                  <ProjectSlider images={featuredProjectImages} />
                  <div className="mt-6">
                    <h3 className="text-xl font-bold mb-3">{featuredProject.title}</h3>
                    <p className="text-muted-foreground">{featuredProject.description}</p>
                    
                    <div className="mt-6">
                      <Link to={`/projects/${featuredProject.id}`}>
                        <Button className="bg-gaza-primary hover:bg-gaza-primary/90">
                          <span>اقرأ المزيد</span>
                          <ArrowLeft className="mr-2" size={16} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  <DonorsList donors={recentDonors} limit={3} />
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* Active Projects Section */}
        <section className="py-12 md:py-16 bg-muted">
          <div className="gaza-container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">مشاريع نشطة</h2>
              <Link to="/projects">
                <Button variant="outline" className="flex items-center">
                  <span>عرض الكل</span>
                  <ArrowLeft className="mr-2" size={16} />
                </Button>
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block border-4 border-t-gaza-primary border-r-gaza-primary border-b-muted border-l-muted rounded-full w-12 h-12 animate-spin"></div>
                <p className="mt-4">جاري تحميل المشاريع...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeProjects.slice(0, 3).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Recent Donors Section */}
        {recentDonors.length > 0 && (
          <section className="py-12 md:py-16">
            <div className="gaza-container">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">آخر المتبرعين</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {recentDonors.map((donor) => (
                  <div key={donor.id} className="bg-card border rounded-lg p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-3">
                      <span className="text-lg font-bold">{donor.name.charAt(0)}</span>
                    </div>
                    <h3 className="font-medium">{donor.name}</h3>
                    <p className="text-gaza-primary font-bold mt-1">
                      {donor.amount.toLocaleString('ar-EG')} $
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(donor.date).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Call to Action Section */}
        <section className="py-12 md:py-16 bg-gaza-primary text-white text-center">
          <div className="gaza-container max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              ساهم معنا في دعم أهلنا في غزة
            </h2>
            <p className="mb-8">
              كل تبرع، مهما كان صغيراً، له أثر كبير. تبرعك اليوم يساعد في توفير الغذاء والماء والدواء والمأوى للأسر المتضررة.
            </p>
            <Button size="lg" className="bg-white text-gaza-primary hover:bg-white/90">
              تبرع الآن
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
