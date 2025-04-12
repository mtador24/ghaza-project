
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  onRefresh: () => void;
}

export function DashboardHeader({ onRefresh }: DashboardHeaderProps) {
  return (
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
          onClick={onRefresh}
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
  );
}
