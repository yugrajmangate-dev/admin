"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAdminStore, SUPER_ADMIN_EMAILS } from "@/lib/admin-store";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { role, setRole, setUser, clearUser } = useAdminStore();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        clearUser();
        router.push("/admin/login");
        setLoading(false);
        return;
      }

      // Set basic user info
      setUser(currentUser.uid, currentUser.email || "");

      // Determine role: super admin by email, else check/create Firestore doc
      if (currentUser.email && SUPER_ADMIN_EMAILS.includes(currentUser.email)) {
        setRole("super_admin");
      } else {
        if (db) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setRole(userDoc.data().role as "vendor" | "super_admin");
          } else {
            // First time login - create vendor profile
            await setDoc(userDocRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              role: "vendor",
              createdAt: new Date().toISOString(),
            });
            setRole("vendor");
          }
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, setRole, setUser, clearUser]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF4F5A]" />
          <p className="text-sm text-slate-400 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!role) return null;

  return <>{children}</>;
}
