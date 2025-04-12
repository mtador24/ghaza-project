
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface MonthlyDonation {
  month: string;
  amount: number;
}

interface MonthlyDonationsChartProps {
  monthlyDonationsData: MonthlyDonation[];
}

export function MonthlyDonationsChart({ monthlyDonationsData }: MonthlyDonationsChartProps) {
  return (
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
  );
}
