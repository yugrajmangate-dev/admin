"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Plus, Search, MapPin, MoreVertical, Star, Compass } from "lucide-react";
import { RestaurantDrawer } from "@/components/admin/restaurant-drawer";
// Use the type or assume fields based on what's in Firestore

export default function RestaurantManager() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, "restaurants"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRestaurants(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRowClick = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Restaurants</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage your listings and virtual tours.
          </p>
        </div>
        <Link href="/admin/restaurants/new">
          <Button className="bg-[#FF4F5A] hover:bg-[#e0434d] text-white rounded-lg shadow-sm border-0 font-semibold px-5 h-10 transition-all active:scale-95">
            <Plus className="mr-2 h-4 w-4" />
            Add Restaurant
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              placeholder="Search..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F5A]/20 focus:border-[#FF4F5A] transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-slate-500 uppercase text-[10px] sm:text-xs font-bold tracking-wider sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Restaurant</th>
                <th className="px-5 py-4">Neighborhood</th>
                <th className="px-5 py-4">Cuisine</th>
                <th className="px-5 py-4">Virtual Tour</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                     Loading restaurants...
                  </td>
                </tr>
              ) : restaurants.length === 0 ? (
                 <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                     <div className="flex flex-col items-center justify-center space-y-3">
                        <Compass className="h-8 w-8 text-gray-300" />
                        <p>No restaurants found. Start by adding one.</p>
                     </div>
                  </td>
                </tr>
              ) : (
                restaurants.map((restaurant) => (
                  <tr 
                    key={restaurant.id} 
                    onClick={() => handleRowClick(restaurant)}
                    className="hover:bg-gray-50 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                         {restaurant.image && <img src={restaurant.image} alt="" className="w-full h-full object-cover" />}
                      </div>
                      {restaurant.name}
                    </td>
                    <td className="px-5 py-4 text-slate-500 font-medium">
                       <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {restaurant.neighborhood}
                       </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <span className="bg-gray-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide">
                         {restaurant.cuisine}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {restaurant.tour ? (
                        <span className="text-[#FF4F5A] text-xs font-semibold uppercase tracking-wider flex items-center">
                            Published
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs uppercase tracking-wider">No Tour</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] uppercase font-bold tracking-widest">
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-slate-900">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <RestaurantDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        restaurant={selectedRestaurant} 
      />
    </div>
  );
}
