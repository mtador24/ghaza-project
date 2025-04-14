
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Package, Users, TrendingUp, Calendar } from "lucide-react";

interface StatsOverviewProps {
  totalProjects: number;
  activeProjects: number;
  totalDonors: number;
  totalRaised: number;
  totalGoal: number;
  raisedPercentage: number;
}

export function StatsOverview({
  totalProjects,
  activeProjects,
  totalDonors,
  totalRaised,
  totalGoal,
  raisedPercentage
}: StatsOverviewProps) {
  // Format numbers for display
  const formattedTotalRaised = totalRaised.toLocaleString('ar-EG');
  const formattedTotalGoal = totalGoal.toLocaleString('ar-EG');
  
  return (
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
              {totalDonors > 0 && totalRaised > 0 ? (
                `متوسط التبرع: ${Math.round(totalRaised / totalDonors).toLocaleString('ar-EG')} $`
              ) : (
                'لا توجد تبرعات بعد'
              )}
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
            <div id="last-donation-info">
              <p className="text-sm text-muted-foreground">آخر تبرع</p>
              <h3 className="text-2xl font-bold mt-1" id="last-donation-days">
                جاري التحميل...
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Calendar className="text-foreground" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-xs">
            <span className="text-muted-foreground" id="last-donor-name">
              جاري تحميل البيانات...
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
