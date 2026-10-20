/* eslint-disable @typescript-eslint/no-explicit-any */
// components/tgadmin/RosterTable.tsx
"use client";

import React, { useState, useTransition } from "react";
import { StudentRosterItem, SeatMetrics, refreshPoolInviteCode, revokeStudentSeat } from "@/actions/institutional";
import {
  Search,
  Copy,
  Check,
  RefreshCw,
  UserX,
  Download,
  ExternalLink,
  ShieldAlert,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface RosterTableProps {
  initialRoster: StudentRosterItem[];
  metrics: SeatMetrics;
  userRole: string;
}

export function RosterTable({ initialRoster, metrics, userRole }: RosterTableProps) {
  const [roster, setRoster] = useState<StudentRosterItem[]>(initialRoster);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isOrgAdmin = userRole === "ORG_ADMIN" || userRole === "ADMIN";

  // Filter roster
  const filteredRoster = roster.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" ||
      student.categories.map((c) => c.toUpperCase()).includes(selectedCategory.toUpperCase());
    return matchesSearch && matchesCategory;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRefreshCode = (poolId: string) => {
    if (!confirm("Are you sure you want to refresh this join code? The previous code will become invalid immediately.")) {
      return;
    }
    startTransition(async () => {
      try {
        await refreshPoolInviteCode(poolId);
      } catch (err: any) {
        alert(err.message || "Failed to refresh invite code.");
      }
    });
  };

  const handleRevoke = (enrollmentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to revoke the active seat for ${studentName}? They will lose access to testing modules.`)) {
      return;
    }
    startTransition(async () => {
      try {
        await revokeStudentSeat(enrollmentId);
        setRoster((prev) =>
          prev.map((s) => (s.enrollmentId === enrollmentId ? { ...s, status: "REVOKED" as const } : s))
        );
      } catch (err: any) {
        alert(err.message || "Failed to revoke student seat.");
      }
    });
  };

  const handleExportCsv = async () => {
  setIsExporting(true);
  try {
    const res = await fetch("/api/tgadmin/export-csv");

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `Export failed with status ${res.status}`);
    }

    const blob = await res.blob();
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `cohort_diagnostic_roster_${new Date().toISOString().slice(0, 10)}.csv`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Revoke object URL to free browser memory
    URL.revokeObjectURL(downloadUrl);
  } catch (err: any) {
    alert(err.message || "Failed to generate CSV export.");
  } finally {
    setIsExporting(false);
  }
};

  return (
    <div className="space-y-6">
      {/* License Pool Summary & Join Codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.licensePools.map((pool) => (
          <div
            key={pool.id}
            className="bg-card border border-slate-200 dark:border-slate-800 rounded-none p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate max-w-[200px]">
                {pool.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 border border-border bg-muted/40 font-semibold">
                {pool.categories.join(", ") || "General"}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black">
                {pool.usedSeats}{" "}
                <span className="text-xs font-normal text-muted-foreground">/ {pool.seatLimit} Seats</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Expires: {new Date(pool.expiresAt).toLocaleDateString()}
              </span>
            </div>

            {/* Invite Code Bar */}
            <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold bg-muted px-2.5 py-1.5 border border-input">
                <span>{pool.inviteCode || "No Active Code"}</span>
                {pool.inviteCode && (
                  <button
                    onClick={() => handleCopyCode(pool.inviteCode!)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                    title="Copy Join Code"
                  >
                    {copiedCode === pool.inviteCode ? (
                      <Check size={13} className="text-green-600" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                )}
              </div>

              {isOrgAdmin && (
                <button
                  disabled={isPending}
                  onClick={() => handleRefreshCode(pool.id)}
                  className="p-1.5 text-xs text-muted-foreground hover:text-foreground border border-input hover:bg-muted transition-colors disabled:opacity-50"
                  title="Rotate Join Code"
                >
                  <RefreshCw size={13} className={isPending ? "animate-spin" : ""} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Roster Controls & Search Header */}
      <div className="bg-card border border-slate-200 dark:border-slate-800 rounded-none p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
            <input
              type="text"
              placeholder="Search by student name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-input bg-background rounded-none focus:outline-hidden focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-semibold py-2 px-3 border border-input bg-background rounded-none"
          >
            <option value="ALL">All Categories</option>
            <option value="SAT">SAT</option>
            <option value="ACT">ACT</option>
            <option value="GRE">GRE</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-muted transition-colors rounded-none disabled:opacity-50"
          >
            <Download size={14} className={isExporting ? "animate-bounce" : ""} />
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      {/* Roster Table */}
      <div className="border border-slate-200 dark:border-slate-800 bg-card rounded-none overflow-x-auto shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">
              <th className="py-3.5 px-4">Student</th>
              <th className="py-3.5 px-4">Class Year</th>
              <th className="py-3.5 px-4">Assigned Pool</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-center">Exams Completed</th>
              <th className="py-3.5 px-4">Enrolled Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredRoster.length > 0 ? (
              filteredRoster.map((student) => {
                const isActive = student.status === "ACTIVE";
                return (
                  <tr key={student.enrollmentId} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground">{student.name}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{student.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-muted-foreground">
                      {student.classYear || "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold">{student.licensePoolName}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {student.categories.join(", ")}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-500/10 border border-green-500/20 px-2 py-0.5">
                          <CheckCircle2 size={11} /> ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-destructive bg-destructive/10 border border-destructive/20 px-2 py-0.5">
                          <AlertCircle size={11} /> REVOKED
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold">
                      {student.completedExamCount}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground font-mono text-[11px]">
                      {new Date(student.enrolledAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/tgadmin/student/${student.profileId}`}
                          className="p-1.5 border border-input text-muted-foreground hover:text-foreground hover:bg-muted inline-flex items-center gap-1 font-semibold text-[11px]"
                          title="Inspect Student Attempt History"
                        >
                          <ExternalLink size={13} />
                          <span>Inspect</span>
                        </a>

                        {isOrgAdmin && isActive && (
                          <button
                            onClick={() => handleRevoke(student.enrollmentId, student.name)}
                            disabled={isPending}
                            className="p-1.5 border border-input text-destructive hover:bg-destructive/10 inline-flex items-center gap-1 font-semibold text-[11px] disabled:opacity-50"
                            title="Revoke Seat Access"
                          >
                            <UserX size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  No students found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}