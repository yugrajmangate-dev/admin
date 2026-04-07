"use client";

import { useState, useEffect, useRef } from "react";
import { type Restaurant, type TourNode, type TourMarker } from "@/lib/restaurants";
import { PhotoSphereViewerManager } from "@/components/virtual-tour/psv-manager";
import { DollhouseEngine } from "@/lib/virtual-tour/dollhouse-engine";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Save, 
  Plus, 
  Map as MapIcon, 
  Box, 
  Image as ImageIcon,
  Trash2,
  ChevronLeft,
  Settings,
  X
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AdminTourEditorProps {
  restaurant: Restaurant;
}

export function AdminTourEditor({ restaurant }: AdminTourEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"360" | "dollhouse">("dollhouse");
  const [tourData, setTourData] = useState(restaurant.tour || { headline: "", nodes: [] });
  const [currentNodeId, setCurrentNodeId] = useState(tourData.nodes?.[0]?.id || "");
  const [saving, setSaving] = useState(false);
  
  const managerRef = useRef<PhotoSphereViewerManager | null>(null);
  const dollhouseRef = useRef<DollhouseEngine | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (viewMode === "360") {
      const node = tourData.nodes.find(n => n.id === currentNodeId);
      if (!node) return;

      const manager = new PhotoSphereViewerManager(containerRef.current, {
        panorama: node.panorama,
        markers: node.markers || [],
        onNodeChange: (targetNodeId) => {
          setCurrentNodeId(targetNodeId);
        }
      });
      managerRef.current = manager;
    } else {
      const engine = new DollhouseEngine(containerRef.current, {
        nodes: tourData.nodes,
        onSphereSelected: (nodeId) => {
          setCurrentNodeId(nodeId);
          toast.info(`Selected node: ${nodeId}`);
        },
        onMarkerAdded: (nodeId, position) => {
          addMarkerToNode(nodeId, position);
        }
      });
      dollhouseRef.current = engine;
    }

    return () => {
      managerRef.current?.destroy();
      dollhouseRef.current?.destroy();
    };
  }, [viewMode, currentNodeId, tourData.nodes]);

  const addMarkerToNode = (nodeId: string, position: { x: number; y: number; z: number }) => {
    setTourData(prev => {
      const newNodes = prev.nodes.map(node => {
        if (node.id === nodeId) {
          const newMarker: TourMarker = {
            id: `marker-${Date.now()}`,
            type: "link",
            label: "New Marker",
            nodeId: "", // Link to other node if needed
            position: { yaw: 0, pitch: 0 } // Standard markers use yaw/pitch
          };
          // In dollhouse mode we use 3D positions, 
          // but we store them in node.markers or a separate collection.
          // For now let's just append.
          return {
            ...node,
            markers: [...(node.markers || []), newMarker]
          };
        }
        return node;
      });
      return { ...prev, nodes: newNodes };
    });
    toast.success("Marker added to node!");
  };

  const handleSave = async () => {
    setSaving(true);
    if (!db) {
      toast.error("Firebase is not initialized");
      setSaving(false);
      return;
    }

    try {
      const restaurantRef = doc(db, "restaurants", restaurant.id);
      await updateDoc(restaurantRef, { tour: tourData });
      toast.success("Tour saved successfully!");
    } catch (error) {
      toast.error("An error occurred while saving.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="h-16 border-b border-slate-700 bg-slate-800 flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center space-x-4">
          <Link href="/admin/dashboard" className="text-slate-400 hover:text-white">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold">Tour Editor: {restaurant.name}</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant={viewMode === "dollhouse" ? "default" : "outline"}
            onClick={() => setViewMode("dollhouse")}
            className="h-9"
          >
            <Box className="mr-2 h-4 w-4" />
            Dollhouse View
          </Button>
          <Button 
            variant={viewMode === "360" ? "default" : "outline"}
            onClick={() => setViewMode("360")}
            className="h-9"
          >
            <MapIcon className="mr-2 h-4 w-4" />
            360 View
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Tour"}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 border-r border-slate-700 bg-slate-800 overflow-y-auto p-4 shrink-0">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase text-slate-500 tracking-wider mb-3">Scenes</h3>
              <div className="space-y-2">
                {tourData.nodes.map(node => (
                  <button
                    key={node.id}
                    onClick={() => setCurrentNodeId(node.id)}
                    className={`w-full flex items-center p-2 rounded-lg transition-colors ${
                      currentNodeId === node.id ? "bg-blue-600 text-white" : "hover:bg-slate-700 text-slate-300"
                    }`}
                  >
                    <ImageIcon size={18} className="mr-3 shrink-0" />
                    <span className="truncate flex-1 text-left">{node.name}</span>
                    {node.markers?.length > 0 && (
                      <span className="ml-2 text-[10px] bg-slate-900/50 px-1.5 rounded-full">
                        {node.markers.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-2 text-slate-400 hover:text-white hover:bg-slate-700 h-9">
                <Plus size={16} className="mr-2" />
                Add Scene
              </Button>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase text-slate-500 tracking-wider mb-3">Instructions</h3>
              <div className="text-xs text-slate-400 space-y-2 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <p>• <b>Dollhouse Mode</b>: Click spheres to select. Click & Drag to inspect space.</p>
                <p>• <b>Shift + Click</b>: Place a marker on a sphere in Dollhouse view.</p>
                <p>• <b>360 Mode</b>: Click markers to travel between connected scenes.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Editor Area */}
        <main className="flex-1 relative bg-[#0a0a0f]">
          <div ref={containerRef} className="w-full h-full" />
          
          {viewMode === "dollhouse" && (
             <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-medium text-slate-200 pointer-events-none shadow-2xl">
                Holding <b>Shift + Click</b> places a link marker on the selected sphere.
             </div>
          )}
        </main>
      </div>
    </div>
  );
}
