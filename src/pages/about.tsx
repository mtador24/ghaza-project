
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Heart, Users, BarChart4, Clock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="gaza-container py-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">عن منصة دعم غزة</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              منصة خيرية مخصصة لدعم أهل غزة في أوقات الأزمات والحروب، نسعى لتقديم المساعدات الإنسانية لمن يحتاجها.
            </p>
          </div>
          
          {/* Mission Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">مهمتنا</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card p-6 rounded-lg border text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-gaza-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-gaza-primary" size={24} />
                </div>
                <h3 className="font-bold mb-2">الإغاثة الإنسانية</h3>
                <p className="text-muted-foreground">
                  توفير المساعدات الإنسانية العاجلة للمتضررين من الحروب والأزمات.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-gaza-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="text-gaza-secondary" size={24} />
                </div>
                <h3 className="font-bold mb-2">دعم المجتمعات</h3>
                <p className="text-muted-foreground">
                  تمكين المجتمعات المتضررة وبناء قدراتها على التعافي والصمود.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-gaza-accent/10 flex items-center justify-center mx-auto mb-4">
                  <BarChart4 className="text-gaza-accent" size={24} />
                </div>
                <h3 className="font-bold mb-2">الشفافية</h3>
                <p className="text-muted-foreground">
                  الالتزام بالشفافية الكاملة في جمع وإدارة وتوزيع التبرعات.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-foreground" size={24} />
                </div>
                <h3 className="font-bold mb-2">الاستدامة</h3>
                <p className="text-muted-foreground">
                  العمل على مشاريع مستدامة تحقق أثراً طويل المدى للمجتمعات المستفيدة.
                </p>
              </div>
            </div>
          </div>
          
          {/* About Us Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold mb-4">من نحن</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  منصة دعم غزة هي مبادرة خيرية غير ربحية تأسست استجابة للأزمات الإنسانية التي يواجهها أهلنا في غزة. نعمل بالتعاون مع شركاء محليين ودوليين لضمان وصول المساعدات بشكل فعال إلى مستحقيها.
                </p>
                <p>
                  تركز المنصة على تلبية الاحتياجات الأساسية مثل الغذاء والماء والدواء والمأوى، بالإضافة إلى دعم المستشفيات والمرافق الصحية المتضررة لتمكينها من تقديم الخدمات الضرورية.
                </p>
                <p>
                  نؤمن بأن العمل الإنساني يجب أن يكون محايداً ويستهدف جميع المحتاجين بغض النظر عن الانتماءات السياسية أو الدينية. كما نلتزم بأعلى معايير الشفافية والمساءلة في إدارة التبرعات.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">كيف نعمل</h2>
              <div className="space-y-6">
                <div className="flex">
                  <div className="w-10 h-10 rounded-full bg-gaza-primary/10 flex items-center justify-center mt-1 ml-4">
                    <span className="font-bold text-gaza-primary">١</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">تحديد الاحتياجات</h3>
                    <p className="text-muted-foreground">
                      نعمل مع فرق ميدانية لتحديد الاحتياجات العاجلة والأولويات في المناطق المتضررة.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-10 h-10 rounded-full bg-gaza-primary/10 flex items-center justify-center mt-1 ml-4">
                    <span className="font-bold text-gaza-primary">٢</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">تصميم المشاريع</h3>
                    <p className="text-muted-foreground">
                      نصمم مشاريع محددة لتلبية هذه الاحتياجات مع أهداف واضحة وميزانيات شفافة.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-10 h-10 rounded-full bg-gaza-primary/10 flex items-center justify-center mt-1 ml-4">
                    <span className="font-bold text-gaza-primary">٣</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">جمع التبرعات</h3>
                    <p className="text-muted-foreground">
                      نطلق حملات لجمع التبرعات لهذه المشاريع من الأفراد والمؤسسات المهتمة.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-10 h-10 rounded-full bg-gaza-primary/10 flex items-center justify-center mt-1 ml-4">
                    <span className="font-bold text-gaza-primary">٤</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">التنفيذ والمتابعة</h3>
                    <p className="text-muted-foreground">
                      ننفذ المشاريع بالتعاون مع شركاء موثوقين ونتابع التقدم بشكل مستمر.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-10 h-10 rounded-full bg-gaza-primary/10 flex items-center justify-center mt-1 ml-4">
                    <span className="font-bold text-gaza-primary">٥</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">التقارير والشفافية</h3>
                    <p className="text-muted-foreground">
                      نقدم تقارير دورية للمتبرعين حول كيفية استخدام تبرعاتهم وتأثيرها.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="bg-gaza-primary text-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">انضم إلينا في دعم أهلنا في غزة</h2>
            <p className="mb-6 max-w-3xl mx-auto">
              تبرعك اليوم يمكن أن يحدث فرقاً كبيراً في حياة العائلات المتضررة. كل مساهمة مهما كانت صغيرة لها تأثير إيجابي.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="#" className="bg-white text-gaza-primary hover:bg-white/90 font-bold py-3 px-6 rounded transition-colors">
                تبرع الآن
              </a>
              <a href="/contact" className="bg-transparent border border-white text-white hover:bg-white/10 font-bold py-3 px-6 rounded transition-colors">
                تواصل معنا
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
