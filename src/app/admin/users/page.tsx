"use client";

import { useState, useEffect } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { UserPlus, Search } from "lucide-react";
import type { User } from "@/types";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Admin",
  department_head: "Dept Head",
  officer: "Officer",
  field_staff: "Field Staff",
};

const ROLE_VARIANTS: Record<string, "danger" | "purple" | "info" | "success"> = {
  super_admin: "danger",
  department_head: "purple",
  officer: "info",
  field_staff: "success",
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<Omit<User, "password">[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (roleFilter) params.set("role", roleFilter);
    fetch(`/api/users?${params}`).then(r => r.json()).then(d => {
      if (d.success) setUsers(d.data);
      setLoading(false);
    });
  }, [roleFilter]);

  const filteredUsers = search
    ? users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    : users;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-[family-name:var(--font-hind)] text-2xl font-bold">User Management</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <UserPlus className="h-4 w-4" /> Add User
        </Button>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex flex-1 gap-2 min-w-[200px]">
            <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1" />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm">
            <option value="">All Roles</option>
            <option value="super_admin">Admin</option>
            <option value="department_head">Dept Head</option>
            <option value="officer">Officer</option>
            <option value="field_staff">Field Staff</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="hidden sm:table-cell px-4 py-3 text-left font-medium">Role</th>
                <th className="hidden md:table-cell px-4 py-3 text-left font-medium">Department</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-[var(--color-muted-foreground)]">Loading...</td></tr>
              ) : filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-muted)]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-white">
                        {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-[var(--color-muted-foreground)]">{user.nameHi}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted-foreground)]">{user.email}</td>
                  <td className="hidden sm:table-cell px-4 py-3">
                    <Badge variant={ROLE_VARIANTS[user.role] || "default"}>{ROLE_LABELS[user.role] || user.role}</Badge>
                  </td>
                  <td className="hidden md:table-cell px-4 py-3">{user.departmentId || "-"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.isActive ? "success" : "default"}>{user.isActive ? "Active" : "Inactive"}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Simple Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Add New User</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: fd.get("name"), email: fd.get("email"), role: fd.get("role"), departmentId: fd.get("departmentId") || null }),
              });
              setShowAddModal(false);
              // Refresh
              const res = await fetch("/api/users");
              const d = await res.json();
              if (d.success) setUsers(d.data);
            }} className="space-y-3">
              <Input label="Full Name" name="name" required placeholder="e.g., Ravi Kumar" />
              <Input label="Email" name="email" type="email" required placeholder="ravi.kumar@imc.gov.in" />
              <div className="space-y-1">
                <label className="block text-sm font-medium">Role</label>
                <select name="role" className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm">
                  <option value="field_staff">Field Staff</option>
                  <option value="officer">Officer</option>
                  <option value="department_head">Dept Head</option>
                  <option value="super_admin">Admin</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium">Department</label>
                <select name="departmentId" className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm">
                  <option value="">None</option>
                  <option value="WATER">Water & Sewerage</option>
                  <option value="PWD">Public Works</option>
                  <option value="ELEC">Electrical</option>
                  <option value="SANIT">Sanitation</option>
                  <option value="HORT">Horticulture</option>
                  <option value="ADMIN">General Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit">Add User</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
