"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  MapPin, 
  UtensilsCrossed,
  Settings,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";

const SIDEBAR_LINKS = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Restaurants", href: "/admin/restaurants", icon: Building2 },
  { name: "Bookings", href: "/admin/bookings", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If we are on the login page, don't show the sidebar/navbar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

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
          transition-transform duration-300 md:translate-x-0
        `}>
          <div className="hidden md:flex items-center gap-3 px-6 py-6 border-b border-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF4F5A]/10 text-[#FF4F5A]">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">DineUp Admin</span>
          </div>

          <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
            {SIDEBAR_LINKS.map((link) => {
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
          
          <div className="p-4 border-t border-gray-100">
            <button className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-500 hover:bg-gray-50 hover:text-slate-900 transition-all">
              <Settings className="h-5 w-5 text-slate-400" />
              Settings
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-y-auto w-full">
          {/* Top Navbar */}
          <header className="hidden md:flex sticky top-0 z-10 w-full h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 items-center justify-between px-8">
            <h1 className="text-xl font-semibold text-slate-800 capitalize">
               {pathname?.split("/").pop() || "Dashboard"}
            </h1>
            <div className="flex items-center gap-4">
              <div className="h-9 w-9 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-gray-500 text-sm font-bold">
                 AD
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
