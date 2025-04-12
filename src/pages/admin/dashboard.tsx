
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthMiddleware } from "@/components/admin/auth-middleware";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { 
  Package, 
  Users, 
  TrendingUp, 
  Calendar, 
  Plus, 
  RefreshCw 
} from "lucide-react";
import { mockProjects } from "@/data/mockData";

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Calculate stats
  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter(p => p.isActive).length;
  const totalDonors = new Set(mockProjects.flatMap(p => p.donors.map(d => d.name))).size;
  const totalRaised = mockProjects.reduce((sum, project) => sum + project.raised, 0);
  const totalGoal = mockProjects.reduce((sum, project) => sum + project.goal, 0);
  const raisedPercentage = Math.round((totalRaised / totalGoal) * 100);
  
  // Format numbers for display
  const formattedTotalRaised = totalRaised.toLocaleString('ar-EG');
  const formattedTotalGoal = totalGoal.toLocaleString('ar-EG');
  
  // Generate data for charts
  const projectStatusData = [
    { name: "مشاريع نشطة", value: activeProjects },
    { name: "مشاريع منتهية", value: totalProjects - activeProjects }
  ];
  
  const COLORS = ["#10B981", "#6B7280"];
  
  // Get monthly donations data
  const getMonthlyDonationsData = () => {
    const months = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    
    // Create a map to hold monthly donation amounts
    const monthlyDonations = new Map(months.map(month => [month, 0]));
    
    // Calculate total donations for each month
    mockProjects.forEach(project => {
      project.donors.forEach(donor => {
        const donationDate = new Date(donor.date);
        const monthName = months[donationDate.getMonth()];
        monthlyDonations.set(monthName, monthlyDonations.get(monthName)! + donor.amount);
      });
    });
    
    // Convert the map to an array of objects for Recharts
    return Array.from(monthlyDonations.entries())
      .map(([month, amount]) => ({ month, amount }));
  };
  
  const monthlyDonationsData = getMonthlyDonationsData();
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <AuthMiddleware>
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        
        <main className="flex-grow p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">لوحة القيادة</h1>
              <p className="text-muted-foreground">مرحباً بك في لوحة إدارة منصة دعم غزة</p>
            </div>
            
            <div className="flex mt-4 md:mt-0 space-x-reverse space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center"
                onClick={() => setIsLoading(true)}
              >
                <RefreshCw size={16} className="ml-2" />
                <span>تحديث</span>
              </Button>
              <Button asChild size="sm" className="bg-gaza-primary hover:bg-gaza-primary/90 flex items-center">
                <Link to="/admin/projects/new">
                  <Plus size={16} className="ml-2" />
                  <span>مشروع جديد</span>
                </Link>
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="inline-block border-4 border-t-gaza-primary border-r-gaza-primary border-b-muted border-l-muted rounded-full w-12 h-12 animate-spin"></div>
                <p className="mt-4 text-lg">جاري تحميل البيانات...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">إجمالي المشاريع</p>
                        <h3 className="text-2xl font-bold mt-1">{totalProjects}</h3>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gaza-primary/10 flex items-center justify-center">
                        <Package className="text-gaza-primary" size={24} />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-xs">
                      <span className="text-gaza-primary font-medium">مشاريع نشطة: {activeProjects}</span>
                      <span className="mx-2">•</span>
                      <span className="text-muted-foreground">منتهية: {totalProjects - activeProjects}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">إجمالي المتبرعين</p>
                        <h3 className="text-2xl font-bold mt-1">{totalDonors}</h3>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gaza-secondary/10 flex items-center justify-center">
                        <Users className="text-gaza-secondary" size={24} />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-xs">
                      <span className="text-gaza-secondary font-medium">
                        متوسط التبرع: {(totalRaised / totalDonors).toLocaleString('ar-EG')} $
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">إجمالي التبرعات</p>
                        <h3 className="text-2xl font-bold mt-1">{formattedTotalRaised} $</h3>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gaza-accent/10 flex items-center justify-center">
                        <TrendingUp className="text-gaza-accent" size={24} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{raisedPercentage}%</span>
                        <span>الهدف: {formattedTotalGoal} $</span>
                      </div>
                      <Progress value={raisedPercentage} className="h-1" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">آخر تبرع</p>
                        <h3 className="text-2xl font-bold mt-1">منذ 3 أيام</h3>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Calendar className="text-foreground" size={24} />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-xs">
                      <span className="text-muted-foreground">
                        آخر متبرع: سارة علي
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>التبرعات الشهرية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={monthlyDonationsData}
                          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `${value}$`}
                          />
                          <Tooltip 
                            formatter={(value: number) => [`${value.toLocaleString('ar-EG')} $`, 'المبلغ']}
                            labelFormatter={(label) => `شهر: ${label}`}
                          />
                          <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>حالة المشاريع</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={projectStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {projectStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => [value, '']}
                            labelFormatter={(name) => `${name}`}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="flex justify-center mt-4 space-x-4 space-x-reverse">
                      {projectStatusData.map((entry, index) => (
                        <div key={index} className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm">{entry.name}: {entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>أحدث المشاريع</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-2 font-medium">اسم المشروع</th>
                          <th className="pb-2 font-medium">المبلغ المستهدف</th>
                          <th className="pb-2 font-medium">المبلغ المحصل</th>
                          <th className="pb-2 font-medium">نسبة الإنجاز</th>
                          <th className="pb-2 font-medium">الحالة</th>
                          <th className="pb-2 font-medium">خيارات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockProjects.slice(0, 5).map((project) => {
                          const percentRaised = Math.round((project.raised / project.goal) * 100);
                          
                          return (
                            <tr key={project.id} className="border-b last:border-0">
                              <td className="py-3 font-medium">{project.title}</td>
                              <td className="py-3">{project.goal.toLocaleString('ar-EG')} $</td>
                              <td className="py-3">{project.raised.toLocaleString('ar-EG')} $</td>
                              <td className="py-3">
                                <div className="flex items-center">
                                  <Progress value={percentRaised} className="h-2 w-20 ml-2" />
                                  <span className="text-sm">{percentRaised}%</span>
                                </div>
                              </td>
                              <td className="py-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    project.isActive
                                      ? "bg-gaza-primary/10 text-gaza-primary"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {project.isActive ? "نشط" : "منتهي"}
                                </span>
                              </td>
                              <td className="py-3">
                                <Link
                                  to={`/admin/projects/${project.id}`}
                                  className="text-gaza-primary hover:underline text-sm"
                                >
                                  عرض التفاصيل
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button variant="outline" asChild size="sm">
                      <Link to="/admin/projects">عرض جميع المشاريع</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
    </AuthMiddleware>
  );
}
