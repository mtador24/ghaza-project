
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

// Public Pages
import HomePage from "./pages/home";
import ProjectPage from "./pages/project";
import ProjectsListPage from "./pages/projects-list";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";

// Admin Pages
import AdminLoginPage from "./pages/admin/login";
import AdminDashboardPage from "./pages/admin/dashboard";
import AdminProjectsListPage from "./pages/admin/projects";
import CreateProjectPage from "./pages/admin/projects/create";
import AdminDonorsListPage from "./pages/admin/donors";
import AdminPaymentMethodsPage from "./pages/admin/payment-methods";
import AdminAccountPage from "./pages/admin/account";
import AdminMembersListPage from "./pages/admin/members/index";
import AdminMemberDetailsPage from "./pages/admin/members/[id]";
import AdminSiteSettingsPage from "./pages/admin/site-settings";

// 404 Page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsListPage />} />
            <Route path="/projects/:id" element={<ProjectPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/projects" element={<AdminProjectsListPage />} />
            <Route path="/admin/projects/create" element={<CreateProjectPage />} />
            <Route path="/admin/donors" element={<AdminDonorsListPage />} />
            <Route path="/admin/payment-methods" element={<AdminPaymentMethodsPage />} />
            <Route path="/admin/account" element={<AdminAccountPage />} />
            <Route path="/admin/members" element={<AdminMembersListPage />} />
            <Route path="/admin/members/:id" element={<AdminMemberDetailsPage />} />
            <Route path="/admin/site-settings" element={<AdminSiteSettingsPage />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
