
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: number;
  name: string;
  address: string;
  image_url: string;
}

export function PaymentMethodsList() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/payment-methods");
        setPaymentMethods(response.data);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        toast({
          title: "خطأ في تحميل طرق الدفع",
          description: "حدث خطأ أثناء محاولة تحميل بيانات طرق الدفع",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [toast]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: "تم نسخ العنوان إلى الحافظة",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="inline-block border-4 border-t-gaza-primary border-r-gaza-primary border-b-muted border-l-muted rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center p-8">
        <CreditCard className="mx-auto text-muted-foreground mb-2" size={32} />
        <p className="text-muted-foreground">لا توجد طرق دفع متاحة حالياً</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {paymentMethods.map((method) => (
        <Card key={method.id} className="overflow-hidden transition-all duration-300 hover:shadow-md group">
          <div className="h-40 overflow-hidden bg-muted relative">
            <img
              src={method.image_url || "/placeholder.svg"}
              alt={method.name}
              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{method.name}</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => copyToClipboard(method.address)}
              >
                <ExternalLink size={16} />
                <span className="sr-only">نسخ العنوان</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded-md overflow-x-auto whitespace-nowrap">
              {method.address}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
