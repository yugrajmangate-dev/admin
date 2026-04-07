"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { UtensilsCrossed, KeyRound, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!auth) {
      toast.error("Firebase Auth is not initialized.");
      setLoading(false);
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful");
      closeAuthModal();
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    if (!auth) {
      toast.error("Firebase Auth is not initialized.");
      setLoading(false);
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Login successful");
      closeAuthModal();
    } catch (error: any) {
      toast.error(error.message || "Google Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 focus:outline-none"
        >
          <X size={16} />
        </button>

        <div className="max-h-[85vh] overflow-y-auto w-full p-8">
           <div className="flex justify-center flex-col items-center mb-8">
             <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 text-[#FF4F5A] shadow-sm mb-4">
               <UtensilsCrossed className="h-7 w-7" />
             </div>
             <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900">
               Welcome Back
             </h2>
             <p className="mt-2 text-center text-sm text-slate-500">
               Sign in to your DineUp account
             </p>
           </div>
           
           <form className="space-y-5" onSubmit={handleEmailLogin}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-slate-900 focus:border-[#FF4F5A] focus:outline-none focus:ring-[#FF4F5A] transition-all"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 text-slate-900 focus:border-[#FF4F5A] focus:outline-none focus:ring-[#FF4F5A] transition-all"
                    placeholder="••••••••"
                  />
                  <KeyRound className="absolute right-3 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#FF4F5A] py-6 text-sm font-bold text-white hover:bg-[#e64650] transition-all"
              >
                {loading ? "Authenticating..." : "Sign in"}
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full rounded-lg border-gray-300 bg-white py-6 text-sm font-bold text-slate-700 shadow-sm hover:bg-gray-50 transition-all font-sans"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                     <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                     <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                     <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                     <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
              </Button>
           </form>
        </div>
      </div>
    </div>
  );
}
