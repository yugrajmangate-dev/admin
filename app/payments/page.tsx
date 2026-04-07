import { CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Payments | DineUp",
};

export default function PaymentsPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="mx-auto max-w-3xl relative z-10 w-full">
        <section className="glass-panel rounded-[2rem] border border-gray-200 bg-white/80 backdrop-blur-xl p-8 sm:p-16 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-indigo-50 text-indigo-500 mb-8 shadow-sm border border-indigo-100">
            <CreditCard className="h-10 w-10" />
          </div>
          
          <h1 className="font-display text-4xl text-slate-900 sm:text-6xl tracking-tight">
            Saved <span className="text-indigo-500">Payments</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
            Manage your cards and viewing billing history. This feature is currently disabled during the beta preview.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button variant="outline" className="rounded-full border-gray-200 px-8 py-6 text-base font-semibold text-slate-700">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
