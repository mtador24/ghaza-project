
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
  monthlyDonationsData: { month: string; amount: number; year: string }[];
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
      
      // Get monthly donations data with years
      const monthlyDonationsData = getMonthlyDonationsByYear();
      
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

// Helper function to get monthly donations data with years
function getMonthlyDonationsByYear() {
  const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];
  
  // جمع كل التبرعات مع السنوات
  const donationsByYearAndMonth = new Map();
  
  mockProjects.forEach(project => {
    project.donors.forEach(donor => {
      const donationDate = new Date(donor.date);
      const year = donationDate.getFullYear().toString();
      const monthName = months[donationDate.getMonth()];
      const key = `${year}-${monthName}`;
      
      // إضافة التبرع إلى الشهر والسنة المناسبين
      if (!donationsByYearAndMonth.has(key)) {
        donationsByYearAndMonth.set(key, { 
          month: monthName, 
          year: year, 
          amount: 0 
        });
      }
      
      // تحديث المبلغ
      const currentData = donationsByYearAndMonth.get(key);
      currentData.amount += donor.amount;
      donationsByYearAndMonth.set(key, currentData);
    });
  });
  
  // تحويل البيانات إلى مصفوفة
  const result = Array.from(donationsByYearAndMonth.values());

  // Ensure all months are included for each year
  const years = [...new Set(result.map(item => item.year))];
  
  const completeData = [];
  years.forEach(year => {
    months.forEach(month => {
      const existingData = result.find(item => item.year === year && item.month === month);
      if (existingData) {
        completeData.push(existingData);
      } else {
        completeData.push({ month, year, amount: 0 });
      }
    });
  });
  
  return completeData;
}
