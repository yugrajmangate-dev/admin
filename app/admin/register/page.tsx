"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { toast } from "sonner";
import { UtensilsCrossed, ChevronRight, Store, MapPin, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Step 1 fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // Registered user (after step 1)
  const [registeredUid, setRegisteredUid] = useState("");

  // Step 2 fields
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [price, setPrice] = useState("$$");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    if (!auth) { toast.error("Auth not initialized"); return; }
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = credential.user.uid;
      if (db) {
        await setDoc(doc(db, "users", uid), { uid, email, role: "vendor", createdAt: new Date().toISOString() });
      }
      setRegisteredUid(uid);
      setStep(2);
      toast.success("Account created! Now set up your restaurant.");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const uid = credential.user.uid;
      if (db) {
        await setDoc(doc(db, "users", uid), {
          uid, email: credential.user.email, role: "vendor", createdAt: new Date().toISOString()
        }, { merge: true });
      }
      setEmail(credential.user.email || "");
      setRegisteredUid(uid);
      setStep(2);
      toast.success("Signed in with Google! Now set up your restaurant.");
    } catch (err: any) {
      toast.error(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !registeredUid) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "restaurants"), {
        name, cuisine, neighborhood, description, image,
        coordinates: [parseFloat(lat || "0"), parseFloat(lng || "0")],
        price,
        ownerId: registeredUid,
        tags: [cuisine, neighborhood].filter(Boolean),
        rating: 4.5,
        suspended: false,
        createdAt: new Date().toISOString(),
      });
      toast.success("Restaurant created and live on DineUp! 🎉");
      router.push("/admin/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to create restaurant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-[#FF4F5A] flex items-center justify-center shadow-lg shadow-[#FF4F5A]/30">
            <UtensilsCrossed className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">DineUp <span className="text-[#FF4F5A]">Admin</span></span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "bg-[#FF4F5A] text-white shadow-md" : "bg-gray-200 text-gray-500"}`}>
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              <span className={`text-sm font-medium ${step >= s ? "text-slate-800" : "text-gray-400"}`}>
                {s === 1 ? "Create Account" : "Restaurant Setup"}
              </span>
              {s < 2 && <ChevronRight className="h-4 w-4 text-gray-300" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {step === 1 ? (
            <div className="p-8">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Create your account</h2>
              <p className="text-sm text-slate-400 mb-6">Register as a restaurant partner on DineUp.</p>

              <button
                onClick={handleGoogleRegister}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-slate-700 font-semibold text-sm hover:bg-gray-50 transition mb-6"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center text-xs text-gray-400 uppercase tracking-widest bg-white px-3 w-fit mx-auto">Or</div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F5A]/30 focus:border-[#FF4F5A] transition" placeholder="you@restaurant.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                  <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F5A]/30 focus:border-[#FF4F5A] transition" placeholder="Min. 8 characters" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                  <input required type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F5A]/30 focus:border-[#FF4F5A] transition" placeholder="Repeat password" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#FF4F5A] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#FF4F5A]/20 hover:bg-[#e0434d] transition flex items-center justify-center gap-2">
                  {loading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "Create Account"}
                  {!loading && <ChevronRight className="h-4 w-4" />}
                </button>
              </form>
              <p className="text-center text-sm text-slate-400 mt-6">Already have an account? <Link href="/admin/login" className="text-[#FF4F5A] font-semibold hover:underline">Sign in</Link></p>
            </div>
          ) : (
            <div className="p-8">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1 flex items-center gap-2">
                <Store className="h-6 w-6 text-[#FF4F5A]" /> Set Up Your Restaurant
              </h2>
              <p className="text-sm text-slate-400 mb-6">This information will appear on DineUp for customers to discover you.</p>
              <form onSubmit={handleRestaurantSetup} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Restaurant Name *</label>
                  <input required value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F5A]/30 focus:border-[#FF4F5A] transition" placeholder="e.g. The Rustic Kitchen" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cuisine *</label>
                    <input required value={cuisine} onChange={e => setCuisine(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F5A]/30 focus:border-[#FF4F5A] transition" placeholder="e.g. Italian" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Price Tier</label>
                    <select value={price} onChange={e => setPrice(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F5A]/30 focus:border-[#FF4F5A] transition">
                      <option value="$">$ (Budget)</option>
                      <option value="$$">$$ (Moderate)</option>
                      <option value="$$$">$$$ (Upscale)</option>
                      <option value="$$$$">$$$$ (Fine Dining)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Neighborhood / Area *</label>
                  <input required value={neighborhood} onChange={e => setNeighborhood(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F5A]/30 focus:border-[#FF4F5A] transition" placeholder="e.g. Koregaon Park, Pune" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Short Description</label>
                  <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F5A]/30 focus:border-[#FF4F5A] transition resize-none" placeholder="Tell customers what makes your place unique..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Latitude</label>
                    <input type="number" step="any" value={lat} onChange={e => setLat(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F5A]/30 focus:border-[#FF4F5A] transition" placeholder="18.5204" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Longitude</label>
                    <input type="number" step="any" value={lng} onChange={e => setLng(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F5A]/30 focus:border-[#FF4F5A] transition" placeholder="73.8567" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hero Image URL</label>
                  <input type="url" value={image} onChange={e => setImage(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F5A]/30 focus:border-[#FF4F5A] transition" placeholder="https://..." />
                  {image && <div className="mt-2 aspect-video rounded-xl overflow-hidden border border-gray-100"><img src={image} alt="preview" className="w-full h-full object-cover" /></div>}
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 border border-gray-200 hover:bg-gray-50 transition">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 bg-[#FF4F5A] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#FF4F5A]/20 hover:bg-[#e0434d] transition flex items-center justify-center gap-2">
                    {loading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <><Check className="h-4 w-4" /> Launch My Restaurant</>}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
