
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  icon: string;
  instructions: string;
  account_number: string;
  is_active: boolean;
}

interface DonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentMethod: PaymentMethod;
  projectId?: number;
}

// تعريف مخطط التحقق من صحة النموذج
const formSchema = z.object({
  projectName: z.string().optional(),
  name: z.string().min(2, { message: "يرجى إدخال الاسم" }),
  country: z.string().min(2, { message: "يرجى إدخال البلد" }),
  contact: z.string().min(5, { message: "يرجى إدخال وسيلة اتصال صحيحة" }),
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }).optional().or(z.literal("")),
  currency: z.string(),
  amount: z.coerce.number().positive({ message: "يجب أن يكون المبلغ أكبر من صفر" }),
  paymentMethodId: z.coerce.number(),
  notes: z.string().optional(),
});

export function DonationDialog({ open, onOpenChange, paymentMethod, projectId }: DonationDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // إعداد نموذج التبرع
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      name: "",
      country: "",
      contact: "",
      email: "",
      currency: "USD",
      amount: 0,
      paymentMethodId: paymentMethod.id,
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: projectId,
          donorData: {
            name: values.name,
            email: values.email,
            phone: values.contact,
            country: values.country,
          },
          amount: values.amount,
          notes: values.notes,
          paymentMethodId: values.paymentMethodId,
          currency: values.currency,
        }),
      });

      if (!response.ok) {
        throw new Error('فشل في إضافة التبرع');
      }

      toast({
        title: "تم إرسال التبرع بنجاح",
        description: "شكرًا لتبرعك. سنتواصل معك قريبًا.",
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('خطأ في إرسال التبرع:', error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إرسال التبرع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md md:max-w-xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>تبرع الآن عبر {paymentMethod.name}</DialogTitle>
          <DialogDescription>
            يرجى ملء النموذج لإكمال عملية التبرع
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {projectId ? null : (
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المشروع</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل الاسم" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البلد</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل البلد" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وسيلة للتواصل</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل رقم الواتساب" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل البريد الإلكتروني" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العملة</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر العملة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">دولار أمريكي</SelectItem>
                        <SelectItem value="EGP">جنيه مصري</SelectItem>
                        <SelectItem value="EUR">يورو</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>قيمة التبرع</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">سعر الصرف بالدولار = 1 دولار أمريكي</p>
              <p className="text-sm text-muted-foreground mb-2">سعر الصرف بالجنيه المصري = 50 جنيه مصري</p>
              <p className="text-sm text-muted-foreground">سعر الصرف باليورو = 0.92 يورو</p>
            </div>

            {paymentMethod.instructions && (
              <div className="bg-muted p-3 rounded-md">
                <h4 className="font-medium mb-1">تعليمات الدفع:</h4>
                <p className="text-sm text-muted-foreground">{paymentMethod.instructions}</p>
                {paymentMethod.account_number && (
                  <p className="text-sm font-medium mt-1">رقم الحساب: {paymentMethod.account_number}</p>
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>غرض التبرع</FormLabel>
                  <FormControl>
                    <Textarea placeholder="اكتب غرض التبرع هنا" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "جاري الإرسال..." : "إرسال"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
