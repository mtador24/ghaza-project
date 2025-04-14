
import { useEffect } from "react";
import { AuthMiddleware } from "@/components/admin/auth-middleware";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { DashboardHeader } from "@/components/admin/dashboard/dashboard-header";
import { StatsOverview } from "@/components/admin/dashboard/stats-overview";
import { MonthlyDonationsChart } from "@/components/admin/dashboard/monthly-donations-chart";
import { ProjectStatusChart } from "@/components/admin/dashboard/project-status-chart";
import { RecentProjectsTable } from "@/components/admin/dashboard/recent-projects-table";
import { LoadingSpinner } from "@/components/admin/dashboard/loading-spinner";
import { useDashboardData } from "@/hooks/useDashboardData";
import { getLastDonationInfo } from "@/api/projectsApi";

export default function AdminDashboardPage() {
  const { data, isLoading, refreshData } = useDashboardData();
  
  useEffect(() => {
    // Update the last donation info
    const updateLastDonationInfo = async () => {
      try {
        const lastDonationInfo = await getLastDonationInfo();
        const daysElement = document.getElementById('last-donation-days');
        const nameElement = document.getElementById('last-donor-name');
        
        if (daysElement && lastDonationInfo) {
          daysElement.textContent = lastDonationInfo.daysSince > 0 
            ? `منذ ${lastDonationInfo.daysSince} أيام` 
            : 'اليوم';
        }
        
        if (nameElement && lastDonationInfo.donorName) {
          nameElement.textContent = `آخر متبرع: ${lastDonationInfo.donorName}`;
        } else if (nameElement) {
          nameElement.textContent = 'لا توجد تبرعات بعد';
        }
      } catch (error) {
        console.error("Error updating last donation info:", error);
      }
    };
    
    if (!isLoading) {
      updateLastDonationInfo();
    }
  }, [isLoading]);
  
  return (
    <AuthMiddleware>
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        
        <main className="flex-grow p-4 md:p-6">
          <DashboardHeader onRefresh={refreshData} />
          
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Stats Overview */}
              {data && (
                <StatsOverview 
                  totalProjects={data.totalProjects}
                  activeProjects={data.activeProjects}
                  totalDonors={data.totalDonors}
                  totalRaised={data.totalRaised}
                  totalGoal={data.totalGoal}
                  raisedPercentage={data.raisedPercentage}
                />
              )}
              
              {/* Charts */}
              {data && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <MonthlyDonationsChart monthlyDonationsData={data.monthlyDonationsData} />
                  <ProjectStatusChart projectStatusData={data.projectStatusData} />
                </div>
              )}
              
              {/* Recent Projects */}
              {data && (
                <RecentProjectsTable projects={data.recentProjects} />
              )}
            </>
          )}
        </main>
      </div>
    </AuthMiddleware>
  );
}
