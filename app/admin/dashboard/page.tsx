"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  collection, query, where, getCountFromServer, getDocs, deleteDoc, doc, updateDoc, orderBy, limit
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdminStore } from "@/lib/admin-store";
import { 
  Building2, Users, CalendarCheck, TrendingUp, ShieldCheck, Trash2, Ban, Eye
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

function KPICard({ title, value, icon: Icon, color }: { title: string; value: number | string; icon: any; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-4xl font-extrabold text-slate-900 mt-2">{value}</p>
      </div>
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}

// Super Admin Dashboard
function SuperAdminDashboard() {
  const [restaurantCount, setRestaurantCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;
    async function fetchData() {
      if (!db) return;
      const restCount = await getCountFromServer(collection(db, "restaurants"));
      setRestaurantCount(restCount.data().count);

      const vendorQuery = query(collection(db, "users"), where("role", "==", "vendor"));
      const vendorCount = await getCountFromServer(vendorQuery);
      setVendorCount(vendorCount.data().count);

      const restDocs = await getDocs(query(collection(db, "restaurants"), limit(20)));
      setRestaurants(restDocs.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    fetchData();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!db || !window.confirm(`Delete ${name}?`)) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "restaurants", id));
      setRestaurants(prev => prev.filter(r => r.id !== id));
      setRestaurantCount(prev => prev - 1);
      toast.success("Restaurant deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const handleSuspend = async (id: string, suspended: boolean) => {
    if (!db) return;
    await updateDoc(doc(db, "restaurants", id), { suspended: !suspended });
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, suspended: !suspended } : r));
    toast.success(!suspended ? "Restaurant suspended" : "Restaurant reactivated");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <ShieldCheck className="h-6 w-6 text-[#FF4F5A]" />
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Super Admin Dashboard</h2>
        </div>
        <p className="text-sm text-slate-500 font-medium">Full platform visibility — you have control over everything.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard title="Total Restaurants" value={restaurantCount} icon={Building2} color="bg-[#FF4F5A]/10 text-[#FF4F5A]" />
        <KPICard title="Registered Vendors" value={vendorCount} icon={Users} color="bg-blue-50 text-blue-500" />
        <KPICard title="Total Bookings" value="–" icon={CalendarCheck} color="bg-emerald-50 text-emerald-500" />
        <KPICard title="Platform Revenue" value="–" icon={TrendingUp} color="bg-violet-50 text-violet-500" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-slate-900">All Restaurants</h3>
          <Link href="/admin/restaurants" className="text-xs text-[#FF4F5A] font-semibold hover:underline">View All →</Link>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Restaurant</th>
              <th className="px-5 py-3 text-left">Neighborhood</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {restaurants.map(r => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 font-semibold text-slate-800 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {r.image && <img src={r.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  {r.name}
                </td>
                <td className="px-5 py-3 text-slate-500">{r.neighborhood}</td>
                <td className="px-5 py-3">
                  {r.suspended 
                    ? <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-100 text-[10px] font-bold uppercase">Suspended</span>
                    : <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase">Active</span>
                  }
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/restaurants/${r.id}/edit`} className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button onClick={() => handleSuspend(r.id, r.suspended)} className="p-1.5 text-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition">
                      <Ban className="h-4 w-4" />
                    </button>
                    <button disabled={deleting === r.id} onClick={() => handleDelete(r.id, r.name)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Vendor Dashboard
function VendorDashboard() {
  const { uid } = useAdminStore();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!db || !uid) { setLoading(false); return; }
    async function fetchData() {
      if (!db || !uid) return;
      const q = query(collection(db, "restaurants"), where("ownerId", "==", uid));
      const snap = await getDocs(q);
      setRestaurants(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    fetchData();
  }, [uid]);

  if (loading) return <div className="flex h-48 items-center justify-center"><div className="h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF4F5A]" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">My Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Manage your restaurant listing on DineUp.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <KPICard title="My Restaurants" value={restaurants.length} icon={Building2} color="bg-[#FF4F5A]/10 text-[#FF4F5A]" />
        <KPICard title="Bookings This Month" value="–" icon={CalendarCheck} color="bg-blue-50 text-blue-500" />
        <KPICard title="Profile Views" value="–" icon={TrendingUp} color="bg-emerald-50 text-emerald-500" />
      </div>

      {restaurants.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">You don't have a restaurant listed yet.</p>
          <p className="text-sm text-slate-400 mt-1 mb-4">Add your first restaurant to get started.</p>
          <button onClick={() => router.push("/admin/restaurants/new")} className="bg-[#FF4F5A] text-white px-6 py-2.5 rounded-lg font-semibold text-sm shadow hover:bg-[#e0434d] transition">
            + Add Restaurant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {restaurants.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="aspect-video bg-gray-100">
                {r.image && <img src={r.image} alt={r.name} className="w-full h-full object-cover" />}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900">{r.name}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{r.neighborhood} · {r.cuisine}</p>
                <Link href={`/admin/restaurants/${r.id}/edit`} className="mt-3 inline-block w-full text-center bg-slate-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition">
                  Edit Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { role } = useAdminStore();

  if (!role) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF4F5A]" />
    </div>
  );

  return role === "super_admin" ? <SuperAdminDashboard /> : <VendorDashboard />;
}
