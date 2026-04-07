import { AddRestaurantForm } from "@/components/admin/add-restaurant-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Add Restaurant | DineUp Admin",
  description: "Add a new restaurant to the DineUp platform",
};

export default function NewRestaurantPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-slate-500 hover:text-slate-300 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold text-white tracking-tight">Return to Dashboard</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AddRestaurantForm />
      </main>
    </div>
  );
}
