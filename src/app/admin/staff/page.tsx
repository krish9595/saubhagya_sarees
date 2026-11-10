import React from "react";
import prisma from "@/lib/prisma";
import { ShieldCheck, UserCheck, Key, Lock } from "lucide-react";

export const revalidate = 0;

export default async function AdminStaffPage() {
  const [users, roles, permissions] = await Promise.all([
    prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.role.findMany({
      include: { permissions: { include: { permission: true } } },
    }),
    prisma.permission.findMany(),
  ]);

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-beige/60 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-normal text-espresso flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gold" />
            Staff Roles & Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs text-charcoal/60">
            Configure administrative permissions, staff accounts, and operational roles
          </p>
        </div>
      </div>

      {/* Staff Users Table */}
      <div className="bg-white border border-beige/60 shadow-xs overflow-hidden">
        <div className="p-4 bg-cream/40 border-b border-beige/30 text-xs font-semibold text-espresso uppercase tracking-wider">
          Active Administrative Accounts ({users.length})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream/20 text-charcoal/70 uppercase tracking-wider text-[10px] border-b border-beige/40">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/20 text-charcoal">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-cream/20 transition-colors">
                  <td className="py-3 px-4 font-serif font-medium text-espresso text-sm">
                    {u.name}
                  </td>
                  <td className="py-3 px-4 font-mono">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/40">
                      {u.role.displayName}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-charcoal/70">{u.phone || "N/A"}</td>
                  <td className="py-3 px-4 text-charcoal/60">
                    {u.lastLoginAt
                      ? new Date(u.lastLoginAt).toLocaleString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Recently Active"}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Definitions */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-medium text-espresso">
          Pre-Configured Enterprise Roles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((r) => (
            <div key={r.id} className="bg-white p-5 border border-beige/60 shadow-xs space-y-2">
              <span className="font-mono text-xs font-bold text-chocolate uppercase tracking-wider block">
                {r.name}
              </span>
              <h4 className="font-serif text-base font-semibold text-espresso">
                {r.displayName}
              </h4>
              <p className="text-xs text-charcoal/70 leading-relaxed min-h-[36px]">
                {r.description || "Operational studio role"}
              </p>
              <div className="pt-2 border-t border-beige/30 text-[11px] text-charcoal/60">
                <span>Access: </span>
                <strong className="text-espresso">
                  {r.name === "SUPER_ADMIN" ? "Full Unrestricted Access" : `${r.permissions.length} Granular Permissions`}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
