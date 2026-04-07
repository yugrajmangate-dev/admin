"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { UtensilsCrossed, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { SUPER_ADMIN_EMAILS } from "@/lib/admin-store";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const ensureUserDoc = async (uid: string, userEmail: string) => {
    if (!db) return;
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      const role = SUPER_ADMIN_EMAILS.includes(userEmail) ? "super_admin" : "vendor";
      await setDoc(userRef, { uid, email: userEmail, role, createdAt: new Date().toISOString() });
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) { toast.error("Firebase Auth not initialized"); return; }
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await ensureUserDoc(cred.user.uid, cred.user.email || "");
      toast.success("Welcome back!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) { toast.error("Firebase Auth not initialized"); return; }
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      await ensureUserDoc(cred.user.uid, cred.user.email || "");
      toast.success("Signed in with Google!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-orange-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="h-14 w-14 rounded-2xl bg-[#FF4F5A] flex items-center justify-center shadow-xl shadow-[#FF4F5A]/30">
            <UtensilsCrossed className="h-8 w-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">DineUp Admin</h1>
            <p className="text-sm text-slate-400 mt-1">Sign in to manage your platform</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3.5 text-slate-700 font-semibold text-sm hover:bg-gray-50 active:scale-[0.98] transition-all mb-6"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
            <div className="relative flex justify-center"><span className="text-xs text-gray-400 uppercase tracking-widest bg-white px-3">Or sign in with email</span></div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@dineup.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF4F5A]/30 focus:border-[#FF4F5A] transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm text-slate-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF4F5A]/30 focus:border-[#FF4F5A] transition"
                />
                <KeyRound className="absolute right-3 top-3.5 h-4 w-4 text-gray-300" />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF4F5A] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-[#FF4F5A]/20 hover:bg-[#e0434d] active:scale-[0.98] transition-all flex items-center justify-center"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            New restaurant partner?{" "}
            <a href="/admin/register" className="text-[#FF4F5A] font-semibold hover:underline">Register your business →</a>
          </p>
        </div>
      </div>
    </div>
  );
}
