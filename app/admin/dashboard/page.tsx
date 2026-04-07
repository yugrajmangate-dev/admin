"use client";

import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Building2, Users, CalendarDays, TrendingUp } from "lucide-react";

export default function DashboardOverviewPage() {
  const [totalRestaurants, setTotalRestaurants] = useState<number | string>("...");

  useEffect(() => {
    async function fetchMetrics() {
      if (!db) return;
      try {
        const snapshot = await getCountFromServer(collection(db, "restaurants"));
        setTotalRestaurants(snapshot.data().count);
      } catch (err) {
        setTotalRestaurants(0);
      }
    }
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 border-none">Overview</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Monitor the vital metrics of the DineUp platform.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Metric 1 */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow group">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
             <Building2 size={80} className="-mt-4 -mr-4 transform rotate-12" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-slate-700 border border-gray-100">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <TrendingUp size={12} className="mr-1" /> +Live
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Total Restaurants</p>
          <h3 className="text-4xl font-extrabold text-slate-900">{totalRestaurants}</h3>
        </div>

        {/* Metric 2 */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow group">
           <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
             <CalendarDays size={80} className="-mt-4 -mr-4 transform rotate-12" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-slate-700 border border-gray-100">
              <CalendarDays className="h-6 w-6" />
            </div>
            <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <TrendingUp size={12} className="mr-1" /> +14%
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Total Bookings</p>
          <h3 className="text-4xl font-extrabold text-slate-900">4,291</h3>
        </div>

        {/* Metric 3 */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow group">
           <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
             <Users size={80} className="-mt-4 -mr-4 transform rotate-12" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-slate-700 border border-gray-100">
              <Users className="h-6 w-6" />
            </div>
            <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <TrendingUp size={12} className="mr-1" /> +8%
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Active Users</p>
          <h3 className="text-4xl font-extrabold text-slate-900">12.5k</h3>
        </div>
      </div>
      
      <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 pt-12 shadow-sm text-center">
         <h3 className="text-xl font-bold text-slate-800 mb-2">Welcome to the Command Center</h3>
         <p className="text-slate-500 max-w-md mx-auto">
           Manage the entire DineUp platform from the sidebar. Detailed analytics modules are rolling out next week.
         </p>
      </div>
    </div>
  );
}
