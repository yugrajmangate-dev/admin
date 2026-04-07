import { AddRestaurantForm } from "@/components/admin/add-restaurant-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewRestaurantPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/restaurants"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Restaurants
        </Link>
      </div>
      <AddRestaurantForm />
    </div>
  );
}
