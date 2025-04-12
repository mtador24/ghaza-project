
import { Donor } from "@/data/mockData";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Heart, CreditCard } from "lucide-react";

interface DonorsListProps {
  donors: Donor[];
  limit?: number;
}

export function DonorsList({ donors, limit }: DonorsListProps) {
  const displayedDonors = limit ? donors.slice(0, limit) : donors;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Heart className="text-gaza-primary ml-2" size={20} />
          قائمة المتبرعين
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayedDonors.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            لا يوجد متبرعون حتى الآن. كن أول من يتبرع!
          </p>
        ) : (
          <ul className="space-y-4">
            {displayedDonors.map((donor) => (
              <li key={donor.id} className="border-b pb-3 last:border-0">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{donor.name}</p>
                    {donor.message && (
                      <p className="text-sm text-muted-foreground mt-1">
                        "{donor.message}"
                      </p>
                    )}
                    {donor.paymentMethod && (
                      <div className="flex items-center mt-1">
                        <CreditCard className="h-3 w-3 text-muted-foreground ml-1" />
                        <span className="text-xs text-muted-foreground">{donor.paymentMethod}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gaza-primary">{donor.amount.toLocaleString('ar-EG')} $</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(donor.date).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        {limit && donors.length > limit && (
          <p className="text-center mt-4 text-sm text-gaza-primary">
            + {donors.length - limit} متبرع آخر
          </p>
        )}
      </CardContent>
    </Card>
  );
}
