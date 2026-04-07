"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Plus, Store, Check, Target, Clock, Utensils, X, Info } from "lucide-react";

export function AddRestaurantForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Basic Fields
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [description, setDescription] = useState("");
  
  // Location & Metrics
  const [lat, setLat] = useState("40.7128");
  const [lng, setLng] = useState("-74.0060");
  const [price, setPrice] = useState("$$$");
  
  // Display Assets
  const [image, setImage] = useState("https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c");
  const [website, setWebsite] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!db) {
      toast.error("Firebase is not initialized");
      setLoading(false);
      return;
    }

    const payload = {
      name,
      cuisine,
      neighborhood,
      description,
      image,
      coordinates: [parseFloat(lat), parseFloat(lng)],
      price,
      website,
      tags: [cuisine, neighborhood].filter(Boolean),
      rating: 4.5,
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, "restaurants"), payload);
      toast.success("Restaurant added successfully!");
      router.push("/admin/restaurants");
    } catch (err) {
      toast.error("Failed to add restaurant. Check permissions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden border-gray-200 bg-white shadow-xl">
      <div className="bg-gray-50 border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center text-slate-900">
            <Store className="mr-3 text-[#FF4F5A] h-6 w-6" />
            Add New Restaurant
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Configure a new dining experience for the DineUp platform.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Core Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center">
              <Info className="w-4 h-4 mr-2" /> Basic Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700">Restaurant Name <span className="text-red-500">*</span></label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-[#FF4F5A] outline-none transition-all" placeholder="e.g. Catch NYC" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700">Cuisine Focus <span className="text-red-500">*</span></label>
                  <input required value={cuisine} onChange={(e) => setCuisine(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-[#FF4F5A] outline-none transition-all" placeholder="e.g. Seafood" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700">Price Tier</label>
                  <select value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-[#FF4F5A] outline-none transition-all">
                    <option value="$">$ (Low)</option>
                    <option value="$$">$$ (Moderate)</option>
                    <option value="$$$">$$$ (High)</option>
                    <option value="$$$$">$$$$ (Ultra)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700">Description <span className="text-red-500">*</span></label>
                <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-[#FF4F5A] outline-none resize-none transition-all" placeholder="A brief description of the atmosphere and food..." />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center">
              <MapPin className="w-4 h-4 mr-2" /> Location & Media
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700">Neighborhood <span className="text-red-500">*</span></label>
                <input required value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-[#FF4F5A] outline-none transition-all" placeholder="e.g. Meatpacking District" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700">Latitude</label>
                  <input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-[#FF4F5A] outline-none font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700">Longitude</label>
                  <input type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-[#FF4F5A] outline-none font-mono text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700">Hero Image URL</label>
                <input type="url" value={image} onChange={(e) => setImage(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-[#FF4F5A] outline-none text-sm italic transition-all" placeholder="https://..." />
                {image && (
                   <div className="mt-3 aspect-video w-full rounded-lg overflow-hidden border border-gray-200 relative group">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={image} alt="Preview" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-xs font-semibold text-white uppercase tracking-widest bg-black/60 px-3 py-1 rounded-full">Preview</span>
                     </div>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-slate-500 hover:text-slate-900 hover:bg-gray-100"
          >
            Cancel
          </Button>

          <Button 
            type="submit" 
            disabled={loading}
            className="bg-[#FF4F5A] hover:bg-[#e0434d] text-white min-w-[140px] shadow-lg shadow-[#FF4F5A]/20"
          >
            {loading ? (
              <span className="animate-pulse">Saving...</span>
            ) : (
              <span className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                Save to Firestore
              </span>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
