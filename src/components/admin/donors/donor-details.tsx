
import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, FileImage, Download, ExternalLink, Upload } from "lucide-react";

interface DonorDetailsProps {
  donorId: number;
}

// واجهة للمتبرع الكاملة
interface DonorDetailsData {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  donations: DonorDonation[];
  paymentProofs: PaymentProof[];
}

// واجهة للتبرع
interface DonorDonation {
  id: number;
  project_id: number;
  donor_id: number;
  amount: number;
  donation_date: string;
  notes: string | null;
  project_title: string;
}

// واجهة لإثبات الدفع
interface PaymentProof {
  id: number;
  donor_id: number;
  donation_id: number;
  image_url: string;
  notes: string | null;
  created_at: string;
}

export function DonorDetails({ donorId }: DonorDetailsProps) {
  const [donor, setDonor] = useState<DonorDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDonationId, setSelectedDonationId] = useState<number | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofNotes, setProofNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedDonor, setEditedDonor] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // جلب بيانات المتبرع
  const fetchDonorDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/admin/donors/${donorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonor(response.data);
      setEditedDonor({
        name: response.data.name,
        email: response.data.email || "",
        phone: response.data.phone || ""
      });
    } catch (error) {
      console.error("Error fetching donor details:", error);
      toast.error("حدث خطأ أثناء جلب بيانات المتبرع");
    } finally {
      setLoading(false);
    }
  };

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    if (donorId) {
      fetchDonorDetails();
    }
  }, [donorId]);

  // وظيفة حفظ تعديلات المتبرع
  const handleSaveDonor = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/admin/donors/${donorId}`, editedDonor, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("تم تحديث بيانات المتبرع بنجاح");
      setEditMode(false);
      fetchDonorDetails();
    } catch (error) {
      console.error("Error updating donor:", error);
      toast.error("حدث خطأ أثناء تحديث بيانات المتبرع");
    } finally {
      setSaving(false);
    }
  };

  // وظيفة رفع إثبات دفع
  const handleUploadProof = async () => {
    if (!proofImage || !selectedDonationId) {
      toast.error("يرجى اختيار صورة والتبرع المرتبط بها");
      return;
    }

    setUploadingProof(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", proofImage);
      formData.append("donationId", selectedDonationId.toString());
      
      if (proofNotes) {
        formData.append("notes", proofNotes);
      }

      await axios.post(`/api/admin/donors/${donorId}/payment-proof`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("تم إضافة إثبات الدفع بنجاح");
      setProofImage(null);
      setProofNotes("");
      setSelectedDonationId(null);
      fetchDonorDetails();
    } catch (error) {
      console.error("Error uploading payment proof:", error);
      toast.error("حدث خطأ أثناء رفع إثبات الدفع");
    } finally {
      setUploadingProof(false);
    }
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">جاري تحميل البيانات...</p>
      </div>
    );
  }

  // التحقق من وجود بيانات
  if (!donor) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">لم يتم العثور على بيانات لهذا المتبرع</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">بيانات المتبرع</h2>
          <p className="text-muted-foreground">
            تم التسجيل في {format(new Date(donor.created_at), "yyyy/MM/dd")}
          </p>
        </div>
        
        {!editMode ? (
          <Button onClick={() => setEditMode(true)}>تعديل البيانات</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditMode(false)}>إلغاء</Button>
            <Button onClick={handleSaveDonor} disabled={saving}>
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white mr-2"></div>
                  جاري الحفظ...
                </>
              ) : "حفظ التغييرات"}
            </Button>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="info">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="info">البيانات الشخصية</TabsTrigger>
          <TabsTrigger value="donations">التبرعات</TabsTrigger>
          <TabsTrigger value="proofs">إثباتات الدفع</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <Card>
            <CardContent className="pt-6">
              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">الاسم</Label>
                    <Input
                      id="name"
                      value={editedDonor.name}
                      onChange={(e) => setEditedDonor({...editedDonor, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedDonor.email}
                      onChange={(e) => setEditedDonor({...editedDonor, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={editedDonor.phone}
                      onChange={(e) => setEditedDonor({...editedDonor, phone: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">الاسم</p>
                    <p className="font-medium">{donor.name}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">البريد الإلكتروني</p>
                    <p className="font-medium">{donor.email || "غير متوفر"}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">رقم الهاتف</p>
                    <p className="font-medium">{donor.phone || "غير متوفر"}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">إجمالي التبرعات</p>
                    <p className="font-medium">
                      {donor.donations.length} تبرع | 
                      ${donor.donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString('ar-EG')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="donations">
          <Card>
            <CardHeader>
              <CardTitle>سجل التبرعات</CardTitle>
              <CardDescription>
                جميع التبرعات التي قام بها المتبرع ({donor.donations.length} تبرع)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {donor.donations.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">لا يوجد تبرعات لهذا المتبرع</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم التبرع</TableHead>
                      <TableHead>المشروع</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>ملاحظات</TableHead>
                      <TableHead>إثبات الدفع</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donor.donations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell className="font-medium">{donation.id}</TableCell>
                        <TableCell>{donation.project_title}</TableCell>
                        <TableCell>${donation.amount.toLocaleString('ar-EG')}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            {format(new Date(donation.donation_date), "yyyy/MM/dd")}
                          </div>
                        </TableCell>
                        <TableCell>{donation.notes || "—"}</TableCell>
                        <TableCell>
                          {donor.paymentProofs.some(p => p.donation_id === donation.id) ? (
                            <div className="flex items-center">
                              <FileImage className="mr-2 h-4 w-4 text-green-500" />
                              <span className="text-green-500">مرفق</span>
                            </div>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedDonationId(donation.id)}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              إضافة إثبات
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          
          {selectedDonationId && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>إضافة إثبات دفع</CardTitle>
                <CardDescription>
                  تبرع رقم: {selectedDonationId}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="proof-image">صورة إثبات الدفع</Label>
                    <Input
                      id="proof-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProofImage(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="proof-notes">ملاحظات (اختياري)</Label>
                    <Input
                      id="proof-notes"
                      value={proofNotes}
                      onChange={(e) => setProofNotes(e.target.value)}
                      placeholder="أي ملاحظات إضافية حول إثبات الدفع"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedDonationId(null);
                    setProofImage(null);
                    setProofNotes("");
                  }}
                >
                  إلغاء
                </Button>
                <Button 
                  onClick={handleUploadProof} 
                  disabled={uploadingProof || !proofImage}
                >
                  {uploadingProof ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white mr-2"></div>
                      جاري الرفع...
                    </>
                  ) : "رفع الإثبات"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="proofs">
          <Card>
            <CardHeader>
              <CardTitle>إثباتات الدفع</CardTitle>
              <CardDescription>
                جميع إثباتات الدفع المرفقة ({donor.paymentProofs.length} إثبات)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {donor.paymentProofs.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">لا يوجد إثباتات دفع لهذا المتبرع</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {donor.paymentProofs.map((proof) => {
                    const donation = donor.donations.find(d => d.id === proof.donation_id);
                    return (
                      <Card key={proof.id} className="overflow-hidden">
                        <div className="aspect-video relative overflow-hidden bg-gray-100">
                          <img 
                            src={proof.image_url}
                            alt={`إثبات دفع رقم ${proof.id}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <p className="font-semibold">تبرع رقم: {proof.donation_id}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(proof.created_at), "yyyy/MM/dd")}
                              </p>
                            </div>
                            {donation && (
                              <p className="text-sm">
                                المشروع: {donation.project_title}
                              </p>
                            )}
                            {proof.notes && (
                              <p className="text-sm text-muted-foreground">
                                {proof.notes}
                              </p>
                            )}
                          </div>
                        </CardContent>
                        <div className="px-3 pb-3 flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            asChild
                          >
                            <a href={proof.image_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              عرض بالحجم الكامل
                            </a>
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
