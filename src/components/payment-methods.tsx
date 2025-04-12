
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Globe 
} from "lucide-react";
import { DonationDialog } from "@/components/donation-dialog";

interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  icon: string;
  instructions: string;
  account_number: string;
  is_active: boolean;
}

interface PaymentMethodsProps {
  methods: PaymentMethod[];
  projectId?: number;
}

// مكون لاختيار أيقونة مناسبة لطريقة الدفع
const PaymentIcon = ({ name }: { name: string }) => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes("vodafone") || lowerName.includes("فودافون") || lowerName.includes("موبايل") || lowerName.includes("mobile")) {
    return <Smartphone className="h-8 w-8" />;
  } else if (lowerName.includes("payeer") || lowerName.includes("perfect") || lowerName.includes("instapay") || lowerName.includes("أنستا")) {
    return <Wallet className="h-8 w-8" />;
  } else if (lowerName.includes("bank") || lowerName.includes("بنك") || lowerName.includes("visa") || lowerName.includes("فيزا")) {
    return <CreditCard className="h-8 w-8" />;
  } else {
    return <Globe className="h-8 w-8" />;
  }
};

export function PaymentMethods({ methods, projectId }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleMethodClick = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setDialogOpen(true);
  };
  
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {methods.map((method) => (
          <Button
            key={method.id}
            variant="outline"
            className="flex flex-col items-center justify-center h-28 p-4 hover:bg-muted"
            onClick={() => handleMethodClick(method)}
          >
            <PaymentIcon name={method.name} />
            <span className="mt-2 text-sm font-medium">{method.name}</span>
          </Button>
        ))}
      </div>
      
      {selectedMethod && (
        <DonationDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          paymentMethod={selectedMethod}
          projectId={projectId}
        />
      )}
    </>
  );
}
