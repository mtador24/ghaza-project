
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from "react";

interface DonationProgressProps {
  raised: number;
  goal: number;
  donationHistory?: { date: string; amount: number }[];
}

export function DonationProgress({ raised, goal, donationHistory }: DonationProgressProps) {
  const percentRaised = Math.min(Math.round((raised / goal) * 100), 100);
  const formattedRaised = raised.toLocaleString('ar-EG');
  const formattedGoal = goal.toLocaleString('ar-EG');
  const remaining = Math.max(goal - raised, 0);
  const formattedRemaining = remaining.toLocaleString('ar-EG');

  // Mock donation history data if not provided
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (donationHistory && donationHistory.length > 0) {
      setChartData(donationHistory.map(item => ({
        name: new Date(item.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
        amount: item.amount
      })));
    } else {
      // Generate mock data if none provided
      const mockData = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        mockData.push({
          name: date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
          amount: Math.floor(Math.random() * 5000) + 1000
        });
      }
      setChartData(mockData);
    }
  }, [donationHistory]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">تقدم حملة التبرعات</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-1">
            <span>تم جمع: {formattedRaised} $</span>
            <span>المتبقي: {formattedRemaining} $</span>
          </div>
          <Progress value={percentRaised} className="h-3" />
          <div className="flex justify-between text-sm">
            <span>نسبة الإنجاز: {percentRaised}%</span>
            <span>الهدف: {formattedGoal} $</span>
          </div>
        </div>

        <div className="pt-4">
          <h4 className="text-sm font-medium mb-3">إحصائيات التبرعات</h4>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 12 }} 
                  width={60}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString('ar-EG')} $`, 'المبلغ']}
                  labelFormatter={(label) => `التاريخ: ${label}`}
                />
                <Bar dataKey="amount" fill="#10B981">
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10B981' : '#3B82F6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
