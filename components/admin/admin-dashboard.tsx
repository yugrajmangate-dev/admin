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
  Box
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
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">DineUp Admin</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Restaurant
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-full text-blue-600">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Listings</p>
              <h3 className="text-2xl font-bold">{restaurants.length}</h3>
            </div>
          </div>
        </Card>
        {/* Other stats cards */}
      </div>

      <Card className="mt-8">
        <div className="p-6 border-b flex items-center justify-between">
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
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Restaurant</th>
                <th className="px-6 py-3">Neighborhood</th>
                <th className="px-6 py-3">Cuisine</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {restaurants.map((restaurant) => (
                <tr key={restaurant.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 font-medium">{restaurant.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{restaurant.neighborhood}</td>
                  <td className="px-6 py-4">{restaurant.cuisine}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <Link href={`/admin/tour-editor/${restaurant.id}`}>
                      <Button variant="outline" size="sm">
                        <Box className="mr-2 h-4 w-4" />
                        Edit Virtual Tour
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="p-8 text-center text-muted-foreground">Loading inventory...</div>}
        </div>
      </Card>
    </div>
  );
}
