
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Project {
  id: string | number;
  title: string;
  goal: number;
  raised: number;
  isActive: boolean;
}

interface RecentProjectsTableProps {
  projects: Project[];
}

export function RecentProjectsTable({ projects }: RecentProjectsTableProps) {
  return (
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
              {projects.map((project) => {
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
  );
}
