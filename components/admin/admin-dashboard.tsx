"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  ExternalLink, 
  ChevronRight, 
  Settings,
  MoreVertical,
  Calendar,
  Users,
  Clock,
  LayoutDashboard,
  Box,
  TrendingUp,
  Activity
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboardComponent() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const response = await fetch("/api/admin/restaurants");
        if (response.ok) {
          const data = await response.json();
          setRestaurants(data);
        }
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
        toast.error("Failed to load restaurants.");
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, []);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-8">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-slate-900 to-slate-500 bg-clip-text text-transparent">Dashboard</h2>
          <p className="text-slate-500 font-medium mt-1">Manage your restaurant portfolio and analytics.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/admin/restaurants/new">
            <Button className="bg-[#FF6B35] hover:bg-[#e05a2b] text-white shadow-[0_8px_24px_rgba(255,107,53,0.28)] hover:shadow-[0_16px_40px_rgba(255,107,53,0.38)] transition-all rounded-full px-6 h-11">
              <Plus className="mr-2 h-4 w-4" />
              Add Restaurant
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Metric 1 */}
        <Card className="relative overflow-hidden border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <LayoutDashboard size={80} className="text-orange-500 -mt-4 -mr-4 transform rotate-12" />
          </div>
          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-orange-50 rounded-2xl text-[#FF6B35]">
                <LayoutDashboard size={22} />
              </div>
              <span className="flex items-center text-emerald-500 text-sm font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                <TrendingUp size={14} className="mr-1" /> +12%
              </span>
            </div>
            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Listings</p>
              <h3 className="text-4xl font-extrabold text-slate-900 mt-1">{restaurants.length}</h3>
            </div>
          </div>
        </Card>

        {/* Metric 2 */}
        <Card className="relative overflow-hidden border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={80} className="text-blue-500 -mt-4 -mr-4 transform rotate-12" />
          </div>
          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <Activity size={22} />
              </div>
              <span className="flex items-center text-emerald-500 text-sm font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                <TrendingUp size={14} className="mr-1" /> +High
              </span>
            </div>
            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Bookings</p>
              <h3 className="text-4xl font-extrabold text-slate-900 mt-1">124</h3>
            </div>
          </div>
        </Card>
        
        {/* Metric 3 */}
        <Card className="relative overflow-hidden border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users size={80} className="text-emerald-500 -mt-4 -mr-4 transform rotate-12" />
          </div>
          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <Users size={22} />
              </div>
            </div>
            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Diners</p>
              <h3 className="text-4xl font-extrabold text-slate-900 mt-1">8,492</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-10 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">Restaurant Inventory</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 border rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-8 py-4 rounded-tl-xl">Restaurant</th>
                <th className="px-6 py-4">Neighborhood</th>
                <th className="px-6 py-4">Cuisine</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-8 py-4 text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {restaurants.map((restaurant) => (
                <tr key={restaurant.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 font-semibold text-slate-900 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden shrink-0 shadow-sm border border-slate-200">
                       <img src={restaurant.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    {restaurant.name}
                  </td>
                  <td className="px-6 py-5 text-slate-500 font-medium">{restaurant.neighborhood}</td>
                  <td className="px-6 py-5 text-slate-600">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                       {restaurant.cuisine}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold inline-flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                      Active
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right space-x-3">
                    <Link href={`/admin/tour-editor/${restaurant.id}`}>
                      <Button variant="outline" size="sm" className="rounded-full border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 font-medium transition-all shadow-sm">
                        <Box className="mr-2 h-4 w-4 text-[#FF6B35]" />
                        Virtual Tour
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && (
            <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="h-8 w-8 border-4 border-slate-200 border-t-[#FF6B35] rounded-full animate-spin"></div>
              <p className="text-slate-400 font-medium">Loading inventory...</p>
            </div>
          )}
        </div>
      </Card>
      
      {/* Background aesthetics */}
      <div className="fixed -z-10 top-0 left-0 w-full h-full overflow-hidden pointer-events-none bg-slate-50/50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </div>
    </div>
  );
}
