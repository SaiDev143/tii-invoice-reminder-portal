// pages/Logs.tsx
import { useState, useMemo, useEffect } from "react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, ArrowLeft } from "lucide-react";

import { EmailLog } from "@/utils/logs";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { useNavigate } from "react-router-dom";
import { Chatbot } from "@/components/Chatbot";

declare global {
  interface Window {
    msalInstance: any;
  }
}

// -------------------------------
// Normalize DynamoDB List Types
// -------------------------------
const normalizeList = (value: any) => {
  if (!value) return [];

  // DynamoDB list type: { L: [ { S:"x" }, { S:"y" } ] }
  if (Array.isArray(value)) {
    // array of strings or primitives
    if (value.every(v => typeof v === "string" || typeof v === "number")) {
      return value.map(v => String(v));
    }

    // array of objects (email_results)
    if (value.every(v => typeof v === "object")) {
      return value;
    }
  }

  return [];
};

// -------------------------------
// Normalize single log object
// -------------------------------
const normalizeLog = (log: any): EmailLog => {
  return {
    log_id: log.log_id,
    timestamp: log.timestamp,
    sent_by: log.sent_by,
    template_used: log.template_used,
    total_invoices_sent: log.total_invoices_sent,

    accounts_selected: normalizeList(log.accounts_selected),
    departments_selected: normalizeList(log.departments_selected),
    statuses_selected: normalizeList(log.statuses_selected),
    billing_periods_selected: normalizeList(log.billing_periods_selected),
    invoice_ids: normalizeList(log.invoice_ids),
    attachments: normalizeList(log.attachments),

    email_content: log.email_content ?? "",

    // NEW: email_results is ignored by UI but safe to keep
    email_results: normalizeList(log.email_results),
  };
};

const Logs = ({ user }: { user: any }) => {
  const navigate = useNavigate();

  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [msalReady, setMsalReady] = useState(false);

  const [filters, setFilters] = useState({
    departments: [] as string[],
    accounts: [] as string[],
    startDate: "",
    endDate: "",
    templates: [] as string[],
  });

  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // -------------------------------
  // MSAL readiness
  // -------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.msalInstance?.getAllAccounts) {
        clearInterval(interval);
        setMsalReady(true);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // -------------------------------
  // FETCH LOGS
  // -------------------------------
  useEffect(() => {
    if (!msalReady) return;

    const fetchLogs = async () => {
      try {
        const msal = window.msalInstance;
        const accounts = msal.getAllAccounts();
        if (accounts.length === 0) return;

        const token = await msal.acquireTokenSilent({
          scopes: [window.__APP_CONFIG__.azure.apiScope],
          account: accounts[0],
        });

        const apiBase = window.__APP_CONFIG__.api.baseUrl.replace(/\/api$/, "");
        const res = await fetch(`${apiBase}/api/logs`, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        });

        if (!res.ok) throw new Error(await res.text());

        const rawLogs = await res.json();
        const finalLogs = rawLogs.map(normalizeLog);

        setLogs(finalLogs);
      } catch (err) {
        console.error("Logs fetch error:", err);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [msalReady]);

  // -------------------------------
  // Filters
  // -------------------------------
  const allDepartments = useMemo(
    () => Array.from(new Set(logs.flatMap(l => l.departments_selected))),
    [logs]
  );

  const allAccounts = useMemo(
    () => Array.from(new Set(logs.flatMap(l => l.accounts_selected))),
    [logs]
  );

  const filteredAccounts = useMemo(() => {
    if (!filters.departments.length) return allAccounts;

    return Array.from(
      new Set(
        logs
          .filter((l) =>
            l.departments_selected.some((d) =>
              filters.departments.includes(d)
            )
          )
          .flatMap((l) => l.accounts_selected)
      )
    );
  }, [logs, filters.departments]);

  const allTemplates = useMemo(
    () => Array.from(new Set(logs.map(l => l.template_used))),
    [logs]
  );

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (
        filters.departments.length &&
        !filters.departments.some((d) =>
          log.departments_selected.includes(d)
        )
      )
        return false;

      if (
        filters.accounts.length &&
        !filters.accounts.some((a) =>
          log.accounts_selected.includes(a)
        )
      )
        return false;

      if (
        filters.startDate &&
        new Date(log.timestamp) < new Date(filters.startDate)
      )
        return false;

      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        if (new Date(log.timestamp) > end) return false;
      }

      if (
        filters.templates.length &&
        !filters.templates.includes(log.template_used)
      )
        return false;

      return true;
    });
  }, [logs, filters]);

  const resetFilters = () => {
    setFilters({
      departments: [],
      accounts: [],
      startDate: "",
      endDate: "",
      templates: [],
    });
  };

  // -------------------------------
  // UI begins
  // -------------------------------
  return (
    <div className="min-h-screen dashboard-gradient">
      <DashboardNavbar user={user} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold">Email Logs</h1>
        <p className="text-muted-foreground">View all past reminder emails</p>

        {/* FILTERS */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Filter Logs</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

              <div>
                <Label>Departments</Label>
                <MultiSelect
                  options={allDepartments.map(d => ({ label: d, value: d }))}
                  selected={filters.departments}
                  onChange={(v) => setFilters({ ...filters, departments: v })}
                />
              </div>

              <div>
                <Label>Accounts</Label>
                <MultiSelect
                  options={filteredAccounts.map(a => ({ label: a, value: a }))}
                  selected={filters.accounts}
                  onChange={(v) => setFilters({ ...filters, accounts: v })}
                />
              </div>

              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters({ ...filters, endDate: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Templates</Label>
                <MultiSelect
                  options={allTemplates.map(t => ({ label: t, value: t }))}
                  selected={filters.templates}
                  onChange={(v) => setFilters({ ...filters, templates: v })}
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* TABLE */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Log History</CardTitle>
            <p className="text-muted-foreground text-sm">
              {filteredLogs.length} logs found
            </p>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p>Loading logs…</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="p-3">Log ID</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Departments</th>
                      <th className="p-3">Accounts</th>
                      <th className="p-3">Template</th>
                      <th className="p-3 text-right">Invoices</th>
                      <th className="p-3">Sent By</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center p-8">
                          No matching logs
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log.log_id} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-mono text-sm">
                            {log.log_id}
                          </td>
                          <td className="p-3">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="p-3">
                            {log.departments_selected.join(", ")}
                          </td>
                          <td className="p-3">
                            {log.accounts_selected.join(", ")}
                          </td>
                          <td className="p-3">
                            <Badge variant="outline">
                              {log.template_used}
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            {log.total_invoices_sent}
                          </td>
                          <td className="p-3">{log.sent_by}</td>
                          <td className="p-3 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedLog(log);
                                setShowDetailModal(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* DETAIL MODAL */}
        {selectedLog && (
          <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Log Details</DialogTitle>
              </DialogHeader>

              <ScrollArea className="max-h-[70vh] pr-4">
                <div className="space-y-6">

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Timestamp</Label>
                      <p>{new Date(selectedLog.timestamp).toLocaleString()}</p>
                    </div>

                    <div>
                      <Label>Sent By</Label>
                      <p>{selectedLog.sent_by}</p>
                    </div>

                    <div>
                      <Label>Template Used</Label>
                      <p>{selectedLog.template_used}</p>
                    </div>

                    <div>
                      <Label>Total Invoices</Label>
                      <p>{selectedLog.total_invoices_sent}</p>
                    </div>
                  </div>

                  <div>
                    <Label>Departments</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedLog.departments_selected.map((d) => (
                        <Badge key={d}>{d}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Accounts</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedLog.accounts_selected.map((a) => (
                        <Badge key={a}>{a}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Statuses</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedLog.statuses_selected.map((s) => (
                        <Badge key={s} variant="outline">{s}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Billing Periods</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedLog.billing_periods_selected.map((p) => (
                        <Badge key={p} variant="outline">{p}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Invoices</Label>
                    <div className="bg-muted p-4 rounded max-h-32 overflow-y-auto">
                      {selectedLog.invoice_ids.join(", ")}
                    </div>
                  </div>

                  {selectedLog.email_content && (
                    <div>
                      <Label>Email Content</Label>
                      <pre className="bg-muted p-4 rounded whitespace-pre-wrap max-h-64 overflow-y-auto">
                        {selectedLog.email_content}
                      </pre>
                    </div>
                  )}

                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </main>

      <Chatbot />
    </div>
  );
};

export default Logs;
