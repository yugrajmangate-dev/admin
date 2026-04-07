"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Building2, 
  LayoutDashboard, 
  Users,
  UtensilsCrossed,
  Settings,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";
import { useAdminStore } from "@/lib/admin-store";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

const VENDOR_LINKS = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "My Restaurant", href: "/admin/restaurants", icon: Building2 },
];

const SUPER_ADMIN_LINKS = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "All Restaurants", href: "/admin/restaurants", icon: Building2 },
  { name: "All Users", href: "/admin/users", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { role, email } = useAdminStore();

  // Skip the layout on login and register pages
  if (pathname === "/admin/login" || pathname === "/admin/register") {
    return <>{children}</>;
  }

  const isSuper = role === "super_admin";
  const links = isSuper ? SUPER_ADMIN_LINKS : VENDOR_LINKS;

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    toast.success("Signed out successfully");
    router.push("/admin/login");
  };

  const avatarInitials = email ? email.substring(0, 2).toUpperCase() : "AD";

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gray-50 text-slate-900 font-sans flex flex-col md:flex-row">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 z-20">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF4F5A]/10 text-[#FF4F5A]">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">DineUp Admin</span>
          </Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 bg-gray-100 p-2 rounded-md">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`
          ${mobileMenuOpen ? 'flex' : 'hidden'} 
          md:flex flex-col fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-10
        `}>
          <div className="hidden md:flex items-center gap-3 px-6 py-6 border-b border-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF4F5A]/10 text-[#FF4F5A]">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">DineUp Admin</span>
              {isSuper && (
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="h-3 w-3 text-[#FF4F5A]" />
                  <span className="text-[10px] text-[#FF4F5A] font-bold uppercase tracking-widest">Super Admin</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
            {links.map((link) => {
              const isActive = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${isActive 
                      ? "bg-[#FF4F5A]/5 text-[#FF4F5A] font-semibold" 
                      : "text-slate-500 hover:bg-gray-50 hover:text-slate-900"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className={`h-5 w-5 ${isActive ? "text-[#FF4F5A]" : "text-slate-400"}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>
          
          <div className="p-4 border-t border-gray-100 space-y-1">
            <Link href="/admin/settings" className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-500 hover:bg-gray-50 hover:text-slate-900 transition-all">
              <Settings className="h-5 w-5 text-slate-400" />
              Settings
            </Link>
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-y-auto w-full">
          {/* Top Navbar */}
          <header className="hidden md:flex sticky top-0 z-10 w-full h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 items-center justify-between px-8">
            <h1 className="text-xl font-semibold text-slate-800 capitalize">
               {pathname?.split("/").pop()?.replace(/-/g, " ") || "Dashboard"}
            </h1>
            <div className="flex items-center gap-3">
              {isSuper && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#FF4F5A] bg-[#FF4F5A]/5 px-3 py-1.5 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Super Admin
                </span>
              )}
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#FF4F5A] to-orange-400 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-white text-sm font-bold">
                {avatarInitials}
              </div>
            </div>
          </header>
          
          <main className="p-4 sm:p-8 flex-1 w-full max-w-[1400px] mx-auto min-h-0">
            {children}
          </main>
        </div>

      </div>
    </AdminAuthGuard>
  );
}
