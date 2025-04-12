
import { useState, useEffect } from "react";
import { mockProjects } from "@/data/mockData";

export interface DashboardData {
  totalProjects: number;
  activeProjects: number;
  totalDonors: number;
  totalRaised: number;
  totalGoal: number;
  raisedPercentage: number;
  projectStatusData: { name: string; value: number }[];
  monthlyDonationsData: { month: string; amount: number }[];
  recentProjects: any[];
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      
      // Calculate dashboard data
      const totalProjects = mockProjects.length;
      const activeProjects = mockProjects.filter(p => p.isActive).length;
      const totalDonors = new Set(mockProjects.flatMap(p => p.donors.map(d => d.name))).size;
      const totalRaised = mockProjects.reduce((sum, project) => sum + project.raised, 0);
      const totalGoal = mockProjects.reduce((sum, project) => sum + project.goal, 0);
      const raisedPercentage = Math.round((totalRaised / totalGoal) * 100);
      
      // Generate data for charts
      const projectStatusData = [
        { name: "مشاريع نشطة", value: activeProjects },
        { name: "مشاريع منتهية", value: totalProjects - activeProjects }
      ];
      
      // Get monthly donations data
      const monthlyDonationsData = getMonthlyDonationsData();
      
      setData({
        totalProjects,
        activeProjects,
        totalDonors,
        totalRaised,
        totalGoal,
        raisedPercentage,
        projectStatusData,
        monthlyDonationsData,
        recentProjects: mockProjects.slice(0, 5)
      });
      
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
    
    loadData();
  }, []);
  
  const refreshData = () => {
    setIsLoading(true);
    
    // In a real application, this would fetch fresh data from the server
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  return { data, isLoading, refreshData };
}

// Helper function to get monthly donations data
function getMonthlyDonationsData() {
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
}
