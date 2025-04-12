
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from "recharts";

interface ProjectStatus {
  name: string;
  value: number;
}

interface ProjectStatusChartProps {
  projectStatusData: ProjectStatus[];
}

export function ProjectStatusChart({ projectStatusData }: ProjectStatusChartProps) {
  const COLORS = ["#10B981", "#6B7280"];
  
  return (
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
  );
}
