"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Clock, Tag, Image as ImageIcon, Star } from "lucide-react";

interface RestaurantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: any | null;
}

export function RestaurantDrawer({ isOpen, onClose, restaurant }: RestaurantDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-200"
          >
            {restaurant ? (
              <>
                {/* Header */}
                <div className="relative h-64 shrink-0 bg-gray-100">
                  {restaurant.image ? (
                     <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon size={48} />
                     </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                  >
                    <X size={16} />
                  </button>

                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="bg-[#FF4F5A] text-white text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm">
                         {restaurant.cuisine}
                       </span>
                       <span className="flex items-center text-yellow-400 text-sm font-semibold">
                         <Star size={14} className="fill-current mr-1" />
                         {restaurant.rating || "4.5"}
                       </span>
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">{restaurant.name}</h2>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                   
                   <div>
                     <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">About</h3>
                     <p className="text-slate-600 text-sm leading-relaxed">
                       {restaurant.description || "No description provided for this restaurant. Update the database entry to show details to the customers."}
                     </p>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center text-gray-500 mb-1">
                          <MapPin size={14} className="mr-1.5" />
                          <span className="text-xs font-medium">Location</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800">{restaurant.neighborhood}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center text-gray-500 mb-1">
                          <Tag size={14} className="mr-1.5" />
                          <span className="text-xs font-medium">Price Rating</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800">{restaurant.price || "$$$"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 col-span-2">
                        <div className="flex items-center text-gray-500 mb-1">
                          <Clock size={14} className="mr-1.5" />
                          <span className="text-xs font-medium">Hours</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800">11:00 AM - 10:00 PM</p>
                      </div>
                   </div>

                   <div>
                     <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Tags & Amenities</h3>
                     <div className="flex flex-wrap gap-2">
                       {(restaurant.tags || [restaurant.cuisine, "Dinner", "Trendy"]).map((tag: string, i: number) => (
                         <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-slate-600 shadow-sm">
                           {tag}
                         </span>
                       ))}
                     </div>
                   </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                   <button className="w-full bg-slate-900 text-white font-semibold rounded-lg py-3 shadow-md hover:bg-slate-800 transition-colors">
                     Edit Restaurant Details
                   </button>
                </div>
              </>
            ) : (
               <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-4">
                 <div className="h-10 w-10 border-4 border-gray-200 border-t-slate-400 rounded-full animate-spin"></div>
                 Loading details...
               </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
