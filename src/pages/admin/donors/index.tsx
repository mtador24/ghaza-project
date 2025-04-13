import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Edit, Trash2, Eye, Filter, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { AuthMiddleware } from "@/components/admin/auth-middleware";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { DonorDetails } from "@/components/admin/donors/donor-details";

// نوع البيانات للمتبرع
interface Donor {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  total_donations: number;
  total_amount: number;
}

// نوع البيانات للتصفح الصفحي
interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminDonorsListPage() {
  const navigate = useNavigate();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmDonorId, setDeleteConfirmDonorId] = useState<number | null>(null);

  // جلب بيانات المتبرعين
  const fetchDonors = async (page = 1, search = searchTerm) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/admin/donors`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: pagination.limit, search }
      });
      
      setDonors(response.data.donors);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching donors:", error);
      toast.error("حدث خطأ أثناء جلب بيانات المتبرعين");
    } finally {
      setLoading(false);
    }
  };

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchDonors();
  }, []);

  // وظيفة البحث
  const handleSearch = () => {
    fetchDonors(1, searchTerm);
  };

  // وظيفة تغيير الصفحة
  const handlePageChange = (page: number) => {
    fetchDonors(page);
  };

  // وظيفة حذف متبرع
  const handleDeleteDonor = async (donorId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/admin/donors/${donorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("تم حذف المتبرع بنجاح");
      fetchDonors(pagination.page);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "حدث خطأ أثناء حذف المتبرع");
    } finally {
      setDeleteConfirmDonorId(null);
    }
  };

  // توليد عناصر التصفح الصفحي
  const renderPaginationItems = () => {
    const { page, totalPages } = pagination;
    const items = [];
    
    // الصفحات المراد عرضها (بحد أقصى 5)
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={page === i} onClick={() => handlePageChange(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // إضافة علامة القطع إذا كان هناك صفحات أكثر
    if (endPage < totalPages) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    return items;
  };

  // Check if we're on the first or last page for pagination navigation
  const isFirstPage = pagination.page === 1;
  const isLastPage = pagination.page === pagination.totalPages;

  return (
    <AuthMiddleware>
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        
        <main className="flex-grow p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">المتبرعون</h1>
            
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
              <div className="relative w-full md:w-64">
                <Input
                  placeholder="بحث عن متبرع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              <Button onClick={handleSearch}>
                بحث
              </Button>
            </div>
          </div>
          
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">الرقم</TableHead>
                    <TableHead>الاسم</TableHead>
                    <TableHead className="hidden md:table-cell">البريد الإلكتروني</TableHead>
                    <TableHead className="hidden md:table-cell">الهاتف</TableHead>
                    <TableHead>عدد التبرعات</TableHead>
                    <TableHead>إجمالي المبلغ</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <div className="flex justify-center">
                          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">جاري تحميل البيانات...</p>
                      </TableCell>
                    </TableRow>
                  ) : donors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <p className="text-muted-foreground">لا يوجد متبرعين للعرض</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    donors.map((donor) => (
                      <TableRow key={donor.id}>
                        <TableCell className="font-medium">{donor.id}</TableCell>
                        <TableCell>{donor.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{donor.email || "—"}</TableCell>
                        <TableCell className="hidden md:table-cell">{donor.phone || "—"}</TableCell>
                        <TableCell>{donor.total_donations}</TableCell>
                        <TableCell>${donor.total_amount?.toLocaleString('ar-EG')}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2 rtl:space-x-reverse">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setSelectedDonor(donor.id);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">عرض التفاصيل</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setDeleteConfirmDonorId(donor.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <span className="sr-only">حذف المتبرع</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            
            {pagination.totalPages > 1 && (
              <CardFooter className="flex justify-center py-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      {isFirstPage ? (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          disabled 
                          className="cursor-not-allowed opacity-50"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="sr-only">Previous page</span>
                        </Button>
                      ) : (
                        <PaginationPrevious onClick={() => handlePageChange(pagination.page - 1)} />
                      )}
                    </PaginationItem>
                    
                    {renderPaginationItems()}
                    
                    <PaginationItem>
                      {isLastPage ? (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          disabled 
                          className="cursor-not-allowed opacity-50"
                        >
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">Next page</span>
                        </Button>
                      ) : (
                        <PaginationNext onClick={() => handlePageChange(pagination.page + 1)} />
                      )}
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            )}
          </Card>
        </main>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedDonor && <DonorDetails donorId={selectedDonor} />}
          </DialogContent>
        </Dialog>
        
        <Dialog 
          open={deleteConfirmDonorId !== null} 
          onOpenChange={(open) => !open && setDeleteConfirmDonorId(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من رغبتك في حذف هذا المتبرع؟ لا يمكن التراجع عن هذا الإجراء.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setDeleteConfirmDonorId(null)}>
                إلغاء
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => deleteConfirmDonorId && handleDeleteDonor(deleteConfirmDonorId)}
              >
                حذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthMiddleware>
  );
}
