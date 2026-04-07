import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "How It Works | DineUp",
  description: "Learn how the DineUp virtual tour experience works.",
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-orange-400/10 rounded-full blur-[100px]" />

      <div className="mx-auto max-w-3xl relative z-10 w-full">
        <section className="glass-panel rounded-[2rem] border border-gray-200 bg-white/80 backdrop-blur-xl p-8 sm:p-16 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-emerald-50 text-emerald-500 -rotate-3 mb-8 shadow-sm border border-emerald-100">
            <Sparkles className="h-10 w-10" />
          </div>
          
          <h1 className="font-display text-4xl text-slate-900 sm:text-6xl tracking-tight">
            How it <span className="text-emerald-500">works</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
            Immerse yourself in our interactive 3D virtual tours to select your exact table before you ever step foot inside. 
            This section is currently under construction.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/#explore-section">
              <Button className="rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-[0_8px_24px_rgba(16,185,129,0.28)] px-8 py-6 text-base font-semibold text-white">
                Try the Experience
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
