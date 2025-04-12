
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      // Reset submission status after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="gaza-container py-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">تواصل معنا</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نحن هنا للإجابة على استفساراتك واستقبال اقتراحاتك. لا تتردد في التواصل معنا.
            </p>
          </div>
          
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-gaza-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-gaza-primary" size={24} />
                </div>
                <h3 className="font-bold mb-2">العنوان</h3>
                <p className="text-muted-foreground">
                  فلسطين، غزة، الشارع الرئيسي
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-gaza-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-gaza-primary" size={24} />
                </div>
                <h3 className="font-bold mb-2">الهاتف</h3>
                <p className="text-muted-foreground">
                  +970 59 123 4567
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-gaza-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-gaza-primary" size={24} />
                </div>
                <h3 className="font-bold mb-2">البريد الإلكتروني</h3>
                <p className="text-muted-foreground">
                  info@gaza-aid.org
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-gaza-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-gaza-primary" size={24} />
                </div>
                <h3 className="font-bold mb-2">ساعات العمل</h3>
                <p className="text-muted-foreground">
                  من الأحد إلى الخميس
                  <br />
                  9:00 ص - 5:00 م
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>
              
              {isSubmitted ? (
                <Card className="bg-gaza-primary/10 border-gaza-primary">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-gaza-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Send className="text-gaza-primary" size={24} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">تم إرسال رسالتك بنجاح!</h3>
                    <p className="text-muted-foreground">
                      شكراً للتواصل معنا. سنقوم بالرد عليك في أقرب وقت ممكن.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      الاسم الكامل <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      البريد الإلكتروني <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      placeholder="أدخل بريدك الإلكتروني"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">
                      الموضوع <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      required
                      placeholder="أدخل موضوع الرسالة"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      الرسالة <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      placeholder="اكتب رسالتك هنا..."
                      rows={5}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="bg-gaza-primary hover:bg-gaza-primary/90 w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full ml-2"></span>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>إرسال الرسالة</>
                    )}
                  </Button>
                </form>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">موقعنا</h2>
              <div className="aspect-square md:aspect-video lg:aspect-square rounded-lg overflow-hidden border">
                {/* Replace with actual map embed if available */}
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <div className="text-center p-4">
                    <MapPin className="mx-auto text-gaza-primary mb-2" size={32} />
                    <p className="font-medium">فلسطين، غزة، الشارع الرئيسي</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      يتم تعطيل عرض الخريطة بسبب الظروف الحالية
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-muted p-4 rounded-lg">
                <h3 className="font-bold mb-2">أوقات تلقي التبرعات العينية</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex justify-between">
                    <span>الأحد - الخميس</span>
                    <span>9:00 ص - 5:00 م</span>
                  </li>
                  <li className="flex justify-between">
                    <span>الجمعة</span>
                    <span>10:00 ص - 2:00 م</span>
                  </li>
                  <li className="flex justify-between">
                    <span>السبت</span>
                    <span>مغلق</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">الأسئلة الشائعة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">كيف يمكنني التبرع؟</h3>
                  <p className="text-muted-foreground">
                    يمكنك التبرع من خلال موقعنا الإلكتروني باستخدام بطاقة الائتمان أو عبر التحويل البنكي. كما يمكنك زيارة مقرنا لتقديم التبرعات العينية.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">هل تبرعي معفى من الضرائب؟</h3>
                  <p className="text-muted-foreground">
                    نعم، منصة دعم غزة هي مؤسسة خيرية مسجلة، وجميع التبرعات معفاة من الضرائب. سنزودك بإيصال للتبرع يمكنك استخدامه للأغراض الضريبية.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">كيف يتم استخدام تبرعي؟</h3>
                  <p className="text-muted-foreground">
                    يتم توجيه تبرعاتك مباشرة إلى المشاريع التي اخترتها. إذا لم تختر مشروعاً محدداً، سيتم توجيه التبرع إلى حيث تكون الحاجة أشد.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">هل يمكنني التطوع؟</h3>
                  <p className="text-muted-foreground">
                    نعم، نرحب بالمتطوعين. يرجى التواصل معنا عبر البريد الإلكتروني مع ذكر مجالات الخبرة والوقت المتاح للتطوع.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
