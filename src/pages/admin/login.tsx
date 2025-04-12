
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, AlertCircle } from "lucide-react";
import { mockUsers } from "@/data/mockData";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // Simulate API authentication with a timeout
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.username === username && u.password === password
      );
      
      if (user) {
        // In a real app, we would store a JWT token in localStorage
        localStorage.setItem("gaza-admin-token", "mock-jwt-token");
        localStorage.setItem("gaza-admin-user", JSON.stringify({
          id: user.id,
          name: user.name,
          role: user.role
        }));
        
        navigate("/admin/dashboard");
      } else {
        setError("اسم المستخدم أو كلمة المرور غير صحيحة");
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="gaza-container max-w-md py-12">
          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-gaza-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="text-gaza-primary" size={28} />
              </div>
              <CardTitle className="text-2xl">دخول لوحة الإدارة</CardTitle>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4 ml-2" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium">
                    اسم المستخدم
                  </label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="أدخل اسم المستخدم"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium">
                    كلمة المرور
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-gaza-primary hover:bg-gaza-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full ml-2"></span>
                      جاري التحقق...
                    </>
                  ) : (
                    "تسجيل الدخول"
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>البيانات الافتراضية للتجربة:</p>
                <p>اسم المستخدم: admin</p>
                <p>كلمة المرور: admin123</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
