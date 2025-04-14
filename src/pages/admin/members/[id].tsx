
import { AuthMiddleware } from "@/components/admin/auth-middleware";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { MemberDetails } from "@/components/admin/members/member-details";

export default function AdminMemberDetailsPage() {
  return (
    <AuthMiddleware>
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        
        <main className="flex-grow p-4 md:p-6">
          <h1 className="text-2xl font-bold mb-6">تفاصيل العضو</h1>
          <MemberDetails />
        </main>
      </div>
    </AuthMiddleware>
  );
}
