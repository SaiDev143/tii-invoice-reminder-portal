import { useState, useMemo, useEffect } from "react";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { InvoiceTable } from "@/components/dashboard/InvoiceTable";
import { TemplateSelector } from "@/components/dashboard/TemplateSelector";
import { PreviewModal } from "@/components/dashboard/PreviewModal";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TEMPLATES } from "@/components/dashboard/TemplateSelector";
import { Chatbot } from "@/components/Chatbot";
import { invoiceAPI } from "@/lib/api";
import FullScreenLoader from "@/components/FullScreenLoader";

export interface Invoice {
  invoice_id: string;
  account_name: string;
  department_name: string;

  billing_period: string;
  due_date: string;
  invoice_amount: number | string;

  status: string;
  payment_status: string;

  paid_timestamp?: string;
  balance_due?: number | string;
  bill_excluding_tax?: number | string;
  processed_timestamp?: string;
  lastupdated?: string;

  payer_account_id?: string;
  realpayer?: string;
  email?: string;
  service_provider?: string;
  s3_object_key: string;
  type?: string;
}

export interface FilterState {
  accounts: string[];
  departments: string[];
  statuses: string[];
  billingPeriods: string[];
}

const Dashboard = ({ user }: { user: any }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    accounts: [],
    departments: [],
    statuses: [],
    billingPeriods: [],
  });

  const [selectedTemplate, setSelectedTemplate] = useState("default");
  const [customTemplateText, setCustomTemplateText] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [sortColumn, setSortColumn] = useState<keyof Invoice | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  /* ============================================================
     FETCH REAL INVOICES FROM BACKEND
     ============================================================ */
  useEffect(() => {
    invoiceAPI
      .list()
      .then((data: any[]) => {
        const cleaned: Invoice[] = data.map((inv: any) => ({
          invoice_id: inv.invoice_id,
          account_name: inv.account_name,
          department_name: inv.department_name,
          billing_period: inv.billing_period,
          due_date: inv.due_date,
          invoice_amount: inv.invoice_amount,
          status: String(inv.status || "").toLowerCase(),
          payment_status: String(inv.payment_status || "").toLowerCase(),
          balance_due: inv.balance_due,
          bill_excluding_tax: inv.bill_excluding_tax,
          paid_timestamp: inv.paid_timestamp,
          processed_timestamp: inv.processed_timestamp,
          lastupdated: inv.lastupdated,
          payer_account_id: inv.payer_account_id,
          realpayer: inv.realpayer,
          email: inv.email,
          service_provider: inv.service_provider,
          s3_object_key: inv.s3_object_key,
          type: inv.type,
        }));
        setInvoices(cleaned);
      })
      .catch((err) => {
        console.error("Failed to load invoices:", err);
        toast({
          title: "Error loading invoices",
          description: "Backend fetch failed",
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  /* ============================================================
     STATS PANEL CALCULATION
     ============================================================ */
  const stats = useMemo(() => {
    const total = invoices.length;
    const paid = invoices.filter((i) => i.payment_status === "paid").length;
    const overdue = invoices.filter((i) => i.status === "over due" || i.status === "overdue").length;
    const due = invoices.filter((i) => i.status === "due").length;
    const totalUnpaid = due + overdue;

    return { total, paid, overdue, due, totalUnpaid };
  }, [invoices]);

  /* ============================================================
     APPLY FILTERS
     ============================================================ */
  const filteredInvoices = useMemo(() => {
    let result = [...invoices];

    if (filters.departments.length) {
      result = result.filter((inv) => filters.departments.includes(inv.department_name));
    }
    if (filters.accounts.length) {
      result = result.filter((inv) => filters.accounts.includes(inv.account_name));
    }
    if (filters.statuses.length) {
      result = result.filter((inv) => {
        const s = inv.status.toLowerCase();
        const ps = inv.payment_status.toLowerCase();

        if (filters.statuses.includes("total_unpaid")) return ps === "unpaid";
        if (filters.statuses.includes("paid")) return ps === "paid";
        if (filters.statuses.includes("due")) return s === "due";
        if (filters.statuses.includes("overdue")) return s === "over due" || s === "overdue";

        return true;
      });
    }
    if (filters.billingPeriods.length) {
      result = result.filter((inv) => filters.billingPeriods.includes(inv.billing_period));
    }

    return result;
  }, [invoices, filters]);

  /* ============================================================
     SAFETY FIX → CLEAR SELECTION ON FILTER CHANGE
     ============================================================ */
  useEffect(() => {
    setSelectedInvoices([]);
  }, [filters]);

  /* ============================================================
     SEND EMAILS
     ============================================================ */
  const confirmSendEmails = async () => {
  try {
    const selectedInvoiceData = invoices.filter(inv =>
      selectedInvoices.includes(inv.invoice_id)
    );

    const templateObj = TEMPLATES[selectedTemplate as keyof typeof TEMPLATES];
    const templateBody = templateObj.body;

    // 1) Get Azure AD token
    const msal = (window as any).msalInstance;
    const accounts = msal.getAllAccounts();
    if (accounts.length === 0) {
      toast({
        title: "Auth Error",
        description: "No Azure AD account found.",
        variant: "destructive",
      });
      return;
    }

    const token = await msal.acquireTokenSilent({
      scopes: [window.__APP_CONFIG__.azure.apiScope],
      account: accounts[0],
    });

    const apiBase = window.__APP_CONFIG__.api.baseUrl.replace(/\/api$/, "");

    // 2) Call backend /api/send-emails
    const sendRes = await fetch(`${apiBase}/api/send-emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invoice_ids: selectedInvoices,
        // send null for default template so Lambda will apply the default template
        template: templateBody || null,
        sent_by: user?.name ?? "Azure AD User",
        attachments: selectedInvoiceData.map((i) => i.s3_object_key),
      }),
    });

    if (!sendRes.ok) {
      const text = await sendRes.text();
      console.error("Send Emails FAILED", text);
      toast({
        title: "Email Send Failed",
        description: "Backend rejected the email request.",
        variant: "destructive",
      });
      return;
    }

    const sendJson = await sendRes.json();
    console.log("Server Response /api/send-emails:", sendJson);

    // NOTE: removed frontend savelog to avoid duplicate DB entries.
    // The backend creates a single EmailLog item and Lambda updates it.

    toast({
      title: "Emails Queued",
      description: `${selectedInvoices.length} invoice(s) queued for ${sendJson.enqueued_departments} department(s).`,
    });

    setShowPreviewModal(false);
    setSelectedInvoices([]);
  } catch (err) {
    console.error("confirmSendEmails error:", err);
    toast({
      title: "Error sending emails",
      description: "Please check backend logs.",
      variant: "destructive",
    });
  }
};

  /* ============================================================
     RENDER UI
     ============================================================ */
  return (
    <div className="min-h-screen dashboard-gradient">
      {loading ? (
        <FullScreenLoader />
      ) : (
        <>
          <DashboardNavbar user={user} />

          <main className="container mx-auto px-4 py-8 space-y-8">
            <DashboardCards stats={stats} />

            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              invoices={invoices}
            />

            <InvoiceTable
              invoices={filteredInvoices}
              selectedInvoices={selectedInvoices}
              onSelectionChange={setSelectedInvoices}
              onSort={(col) => {
                setSortColumn(col);
                setSortDirection(sortDirection === "asc" ? "desc" : "asc");
              }}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
            />

            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
              customTemplateText={customTemplateText}
              onCustomTemplateChange={setCustomTemplateText}
            />

            <div className="flex justify-center pb-8">
              <Button
                size="lg"
                className="btn-gradient text-lg px-8 py-6 focus-ring"
                onClick={() => setShowPreviewModal(true)}
                disabled={selectedInvoices.length === 0}
              >
                <Send className="mr-2 h-5 w-5" />
                Send Reminder Emails
              </Button>
            </div>
          </main>

          <PreviewModal
            open={showPreviewModal}
            onOpenChange={setShowPreviewModal}
            selectedInvoices={selectedInvoices}
            invoices={filteredInvoices}
            template={selectedTemplate}
            onConfirm={confirmSendEmails}
            onRemoveInvoice={(id) =>
              setSelectedInvoices((prev) => prev.filter((i) => i !== id))
            }
          />

          <Chatbot />
        </>
      )}
    </div>
  );
};

export default Dashboard;
