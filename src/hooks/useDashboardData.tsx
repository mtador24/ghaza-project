
import { useState, useEffect } from "react";
import { 
  getProjects, 
  getDonationStats, 
  getLatestDonations, 
  getMonthlyDonations 
} from "@/api/projectsApi";

export interface DashboardData {
  totalProjects: number;
  activeProjects: number;
  totalDonors: number;
  totalRaised: number;
  totalGoal: number;
  raisedPercentage: number;
  projectStatusData: { name: string; value: number }[];
  monthlyDonationsData: { month: string; amount: number; year: string }[];
  recentProjects: any[];
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch real data from API endpoints
        const [projects, stats, monthlyDonationsData] = await Promise.all([
          getProjects(),
          getDonationStats(),
          getMonthlyDonations()
        ]);
        
        // Ensure we have valid data
        if (!projects || !stats || !monthlyDonationsData) {
          throw new Error("Failed to fetch dashboard data");
        }
        
        // Calculate dashboard data from real data
        const totalProjects = projects.length;
        const activeProjects = projects.filter(p => p.is_active).length;
        const totalDonors = stats.totalDonors || 0;
        const totalRaised = projects.reduce((sum, project) => sum + (project.raised || 0), 0);
        const totalGoal = projects.reduce((sum, project) => sum + (project.goal || 0), 0);
        const raisedPercentage = totalGoal > 0 ? Math.round((totalRaised / totalGoal) * 100) : 0;
        
        // Generate data for charts
        const projectStatusData = [
          { name: "مشاريع نشطة", value: activeProjects },
          { name: "مشاريع منتهية", value: totalProjects - activeProjects }
        ];
        
        setData({
          totalProjects,
          activeProjects,
          totalDonors,
          totalRaised,
          totalGoal,
          raisedPercentage,
          projectStatusData,
          monthlyDonationsData: monthlyDonationsData.map(item => ({
            month: item.month,
            year: item.year,
            amount: item.amount
          })),
          recentProjects: projects.slice(0, 5)
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        // Set default data in case of error
        setData({
          totalProjects: 0,
          activeProjects: 0,
          totalDonors: 0,
          totalRaised: 0,
          totalGoal: 0,
          raisedPercentage: 0,
          projectStatusData: [
            { name: "مشاريع نشطة", value: 0 },
            { name: "مشاريع منتهية", value: 0 }
          ],
          monthlyDonationsData: [],
          recentProjects: []
        });
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };
    
    loadData();
  }, []);
  
  const refreshData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch fresh data from API endpoints
      const [projects, stats, monthlyDonationsData] = await Promise.all([
        getProjects(),
        getDonationStats(),
        getMonthlyDonations()
      ]);
      
      // Calculate dashboard data
      const totalProjects = projects.length;
      const activeProjects = projects.filter(p => p.is_active).length;
      const totalDonors = stats.totalDonors || 0;
      const totalRaised = projects.reduce((sum, project) => sum + (project.raised || 0), 0);
      const totalGoal = projects.reduce((sum, project) => sum + (project.goal || 0), 0);
      const raisedPercentage = totalGoal > 0 ? Math.round((totalRaised / totalGoal) * 100) : 0;
      
      // Generate data for charts
      const projectStatusData = [
        { name: "مشاريع نشطة", value: activeProjects },
        { name: "مشاريع منتهية", value: totalProjects - activeProjects }
      ];
      
      setData({
        totalProjects,
        activeProjects,
        totalDonors,
        totalRaised,
        totalGoal,
        raisedPercentage,
        projectStatusData,
        monthlyDonationsData: monthlyDonationsData.map(item => ({
          month: item.month,
          year: item.year,
          amount: item.amount
        })),
        recentProjects: projects.slice(0, 5)
      });
    } catch (error) {
      console.error("Error refreshing dashboard data:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };
  
  return { data, isLoading, refreshData };
}
