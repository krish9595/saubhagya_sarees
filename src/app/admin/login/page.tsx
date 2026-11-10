"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@saubhagyasarees.com");
  const [password, setPassword] = useState("Saubhagya@2026");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin");
      } else {
        setError(data.message || "Invalid administrative credentials.");
      }
    } catch {
      setError("Network error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-espresso flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Subtle luxury ambient pattern */}
      <div className="absolute inset-0 bg-radial-at-c from-chocolate/50 to-espresso opacity-60" />

      <div className="relative z-10 w-full max-w-md bg-ivory border border-gold/40 shadow-2xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-chocolate font-bold block">
            Enterprise Admin Portal
          </span>
          <h1 className="font-serif text-3xl font-normal text-espresso">
            Saubhagya Sarees
          </h1>
          <p className="text-xs text-charcoal/60">
            Bridal Studio Management System • Hisar
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label htmlFor="adminEmailInput" className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
              Staff Email Address
            </label>
            <div className="relative">
              <input
                id="adminEmailInput"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@saubhagyasarees.com"
                className="w-full pl-3 pr-10 py-3 bg-white border border-beige/80 text-charcoal focus:outline-none focus:border-gold"
                required
              />
              <Mail className="w-4 h-4 text-charcoal/40 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label htmlFor="adminPasswordInput" className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
              Security Key / Password
            </label>
            <div className="relative">
              <input
                id="adminPasswordInput"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-3 pr-10 py-3 bg-white border border-beige/80 text-charcoal focus:outline-none focus:border-gold"
                required
              />
              <Lock className="w-4 h-4 text-charcoal/40 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="p-3 bg-cream/40 border border-beige/40 text-[11px] text-charcoal/70 space-y-1">
            <p className="font-semibold text-espresso">Default Studio Credentials:</p>
            <p>Email: <code className="text-chocolate">admin@saubhagyasarees.com</code></p>
            <p>Password: <code className="text-chocolate">Saubhagya@2026</code></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold py-3.5 transition-all shadow-md group disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <span>Enter Admin Console</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-beige/30 flex items-center justify-between text-[11px] text-charcoal/50">
          <Link href="/" className="hover:text-gold flex items-center gap-1">
            ← Return to Storefront
          </Link>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            Role-Based Access Control
          </span>
        </div>
      </div>
    </div>
  );
}
