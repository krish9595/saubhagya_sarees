import React from "react";
import prisma from "@/lib/prisma";
import { History, ShieldAlert } from "lucide-react";

export const revalidate = 0;

export default async function AdminAuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-beige/60 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-normal text-espresso flex items-center gap-2">
            <History className="w-5 h-5 text-gold" />
            Security & Activity Audit Trail
          </h1>
          <p className="text-xs text-charcoal/60">
            Immutable log of all administrative actions, logins, status changes, and catalogue updates
          </p>
        </div>
      </div>

      <div className="bg-white border border-beige/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream/40 text-charcoal/70 uppercase tracking-wider text-[10px] border-b border-beige/40">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Staff User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Operational Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/20 text-charcoal">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-cream/20 transition-colors">
                  <td className="py-3 px-4 text-charcoal/60 text-[11px] whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("en-IN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-4 font-medium text-espresso">
                    {log.user?.name || log.userEmail || "System Administrator"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        log.action === "CREATE"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : log.action === "DELETE"
                          ? "bg-red-50 text-red-800 border border-red-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-chocolate font-semibold">{log.entity}</td>
                  <td className="py-3 px-4 text-charcoal/80 max-w-md">{log.details || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
