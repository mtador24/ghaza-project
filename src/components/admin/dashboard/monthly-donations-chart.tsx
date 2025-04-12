
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MonthlyDonation {
  month: string;
  amount: number;
  year: string;
}

interface MonthlyDonationsChartProps {
  monthlyDonationsData: MonthlyDonation[];
}

export function MonthlyDonationsChart({ monthlyDonationsData }: MonthlyDonationsChartProps) {
  // استخراج السنوات المتاحة من البيانات
  const availableYears = [...new Set(monthlyDonationsData.map(item => item.year))].sort((a, b) => Number(b) - Number(a));
  
  // تعيين السنة الحالية كقيمة افتراضية، أو آخر سنة متاحة إذا لم تكن السنة الحالية موجودة
  const defaultYear = availableYears.includes(new Date().getFullYear().toString()) 
    ? new Date().getFullYear().toString() 
    : availableYears[0] || "";
  
  const [selectedYear, setSelectedYear] = useState(defaultYear);

  // تصفية البيانات حسب السنة المختارة
  const filteredData = monthlyDonationsData.filter(item => item.year === selectedYear);

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>التبرعات الشهرية</CardTitle>
        <div className="w-32">
          <Select 
            value={selectedYear} 
            onValueChange={setSelectedYear}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر السنة" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
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
                labelFormatter={(label) => `شهر: ${label} - ${selectedYear}`}
              />
              <Legend />
              <Bar dataKey="amount" name="المبلغ المحصل" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
