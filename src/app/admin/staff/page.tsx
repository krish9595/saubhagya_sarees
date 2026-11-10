"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, UserPlus, Edit3, Trash2, Key, Check, AlertCircle, X, ShieldAlert } from "lucide-react";

export default function AdminStaffPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    roleId: "",
    isActive: true,
  });

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/staff");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setRoles(data.roles);
        if (data.roles[0] && !formData.roleId) {
          setFormData((prev) => ({ ...prev, roleId: data.roles[0].id }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      email: "",
      phone: "",
      password: "",
      roleId: roles[0]?.id || "",
      isActive: true,
    });
    setEditingUser(null);
    setShowAddModal(false);
  };

  const openEditModal = (u: any) => {
    setEditingUser(u);
    setFormData({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || "",
      password: "", // Leave blank unless changing
      roleId: u.roleId,
      isActive: u.isActive,
    });
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const isEditing = !!editingUser;
      const url = "/api/admin/staff";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({
          type: "success",
          text: isEditing
            ? `Successfully updated account for ${formData.name}`
            : `Created staff account for ${formData.name}`,
        });
        resetForm();
        fetchStaffData();
        setTimeout(() => setStatusMessage(null), 3500);
      } else {
        setStatusMessage({
          type: "error",
          text: data.message || "Failed to save staff member",
        });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: "error", text: err?.message || "An error occurred" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (u: any) => {
    try {
      const res = await fetch("/api/admin/staff", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: u.id,
          isActive: !u.isActive,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchStaffData();
      } else {
        alert(data.message || "Could not update status");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteStaff = async (u: any) => {
    if (!confirm(`Are you sure you want to delete staff account for "${u.name}" (${u.email})?`)) return;

    try {
      const res = await fetch(`/api/admin/staff?id=${u.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: "success", text: `Deleted staff member ${u.name}` });
        fetchStaffData();
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        setStatusMessage({ type: "error", text: data.message || "Could not delete staff member" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-beige/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-normal text-espresso flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gold" />
            Staff Roles & Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs text-charcoal/60">
            Create, edit, and assign roles for store managers, inventory auditors, and administrators
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold px-4 py-2.5 flex items-center gap-2 transition-colors shadow-xs"
        >
          <UserPlus className="w-4 h-4 text-gold" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-3 text-xs flex items-center gap-2 border ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
              : "bg-red-50 text-red-800 border-red-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <Check className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Staff Users Table */}
      <div className="bg-white border border-beige/60 shadow-xs overflow-hidden">
        <div className="p-4 bg-cream/40 border-b border-beige/30 text-xs font-semibold text-espresso uppercase tracking-wider flex justify-between items-center">
          <span>Active Administrative Accounts ({users.length})</span>
          <span className="text-[11px] text-charcoal/60 lowercase font-normal">
            Click edit to update role or reset credentials
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream/20 text-charcoal/70 uppercase tracking-wider text-[10px] border-b border-beige/40">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/20 text-charcoal">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-charcoal/50">
                    Loading administrative accounts...
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-cream/20 transition-colors">
                    <td className="py-3 px-4 font-serif font-medium text-espresso text-sm">
                      {u.name}
                    </td>
                    <td className="py-3 px-4 font-mono">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/40">
                        {u.role?.displayName || u.role?.name || "Staff"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-charcoal/70">{u.phone || "—"}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(u)}
                        className={`px-2 py-0.5 text-[10px] uppercase font-bold border transition-colors ${
                          u.isActive
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                            : "bg-red-50 text-red-800 border-red-200 hover:bg-red-100"
                        }`}
                        title="Click to toggle active status"
                      >
                        {u.isActive ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 bg-cream/80 hover:bg-gold/20 text-chocolate hover:text-espresso rounded-xs transition-colors"
                          title="Edit Staff Member"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(u)}
                          className="p-1.5 bg-cream/80 hover:bg-red-50 text-charcoal/60 hover:text-red-700 rounded-xs transition-colors"
                          title="Delete Staff Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
              <p className="text-xs text-charcoal/60">{r.description || "System RBAC Profile"}</p>
              <div className="pt-2 border-t border-beige/30 flex flex-wrap gap-1">
                {r.permissions?.map((p: any) => (
                  <span
                    key={p.permission?.id || p.id}
                    className="text-[9px] bg-cream px-1.5 py-0.5 border border-beige/40 text-charcoal/70"
                  >
                    {p.permission?.name || p.slug}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Staff Modal */}
      {(showAddModal || editingUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-charcoal/70 backdrop-blur-xs"
            onClick={resetForm}
            aria-hidden="true"
          />
          <div
            className="relative z-10 w-full max-w-lg bg-white border border-beige/60 shadow-2xl p-6 sm:p-8"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-beige/40 mb-5">
              <h3 className="font-serif text-xl font-medium text-espresso flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold" />
                {editingUser ? `Edit Staff: ${editingUser.name}` : "Create New Staff Account"}
              </h3>
              <button
                onClick={resetForm}
                className="p-1 text-charcoal/60 hover:text-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-espresso font-medium"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  disabled={!!editingUser}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="staff@saubhagyasarees.com"
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-espresso font-mono disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 99960 XXXXX"
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-espresso"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                  Assigned RBAC Role *
                </label>
                <select
                  required
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-espresso font-semibold"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.displayName} ({r.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                  {editingUser ? "Reset Password (leave empty to keep existing)" : "Account Password *"}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? "••••••••" : "Minimum 6 characters"}
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-espresso"
                />
              </div>

              {editingUser && (
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="accent-gold w-4 h-4"
                    />
                    <span className="font-semibold text-espresso">Account Active & Authorized to Login</span>
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-beige/30">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-beige/80 text-charcoal/80 hover:bg-cream font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-chocolate hover:bg-espresso text-ivory font-semibold uppercase tracking-widest transition-colors disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingUser ? "Update Staff" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
