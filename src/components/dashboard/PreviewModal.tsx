import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Invoice } from "@/pages/Dashboard";
import { X, FileText, Mail } from "lucide-react";
import { TEMPLATES } from "@/components/dashboard/TemplateSelector";

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedInvoices: string[];
  invoices: Invoice[];
  template: string;
  onConfirm: () => void;
  onRemoveInvoice: (invoiceId: string) => void;
}

export const PreviewModal = ({
  open,
  onOpenChange,
  selectedInvoices,
  invoices,
  template,
  onConfirm,
  onRemoveInvoice
}: PreviewModalProps) => {
  const selectedInvoiceData = invoices.filter(inv => 
    selectedInvoices.includes(inv.invoice_id)
  );

  // Group invoices by account
  const groupedByAccount = selectedInvoiceData.reduce((acc, invoice) => {
    if (!acc[invoice.account_name]) {
      acc[invoice.account_name] = [];
    }
    acc[invoice.account_name].push(invoice);
    return acc;
  }, {} as Record<string, Invoice[]>);

  const totalAmount = selectedInvoiceData.reduce((sum, inv) => sum + inv.balance_due, 0);
  const dueCount = selectedInvoiceData.filter(inv => inv.payment_status === "due").length;
  const overdueCount = selectedInvoiceData.filter(inv => inv.payment_status === "overdue").length;

  // Get template body
  const templateData = TEMPLATES[template as keyof typeof TEMPLATES];
  const emailPreview = templateData ? templateData.body : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center">
            <Mail className="mr-2 h-6 w-6 text-primary" />
            Preview Email Batch
          </DialogTitle>
          <DialogDescription>
            Review the selected invoices, recipients, and email content before sending reminders
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="space-y-6">
            {/* Summary Section */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-lg">Batch Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Invoices</p>
                  <p className="text-xl font-bold">{selectedInvoiceData.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Due Invoices</p>
                  <p className="text-xl font-bold text-warning">{dueCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Overdue Invoices</p>
                  <p className="text-xl font-bold text-destructive">{overdueCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Amount</p>
                  <p className="text-xl font-bold text-primary">
                    ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Template:</strong> {templateData?.name || "Unknown"}
                </p>
              </div>
            </div>

            <Separator />

            {/* Email Content Preview */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Email Content Preview</h3>
              <Textarea
                value={emailPreview}
                readOnly
                className="min-h-[200px] font-mono text-sm bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Placeholders (e.g., [Account Name], [Invoice ID]) will be replaced with actual data for each invoice.
              </p>
            </div>

            <Separator />

            {/* Grouped Invoices by Account */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Invoices by Account</h3>
              {Object.entries(groupedByAccount).map(([accountName, accountInvoices]) => {
                const accountDue = accountInvoices.filter(i => i.payment_status === "due").length;
                const accountOverdue = accountInvoices.filter(i => i.payment_status === "overdue").length;
                
                return (
                  <div key={accountName} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-base">{accountName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {accountInvoices[0].email}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          You have <strong>{accountInvoices.length}</strong> invoice{accountInvoices.length > 1 ? 's' : ''} 
                          {accountDue > 0 && ` — ${accountDue} due`}
                          {accountOverdue > 0 && `, ${accountOverdue} overdue`}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-primary/10">
                        {accountInvoices.length} invoice{accountInvoices.length > 1 ? 's' : ''}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {accountInvoices.map(invoice => (
                        <div
                          key={invoice.invoice_id}
                          className="flex items-center justify-between bg-muted/30 rounded p-3 text-sm"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-mono font-medium">{invoice.invoice_id}</p>
                              <p className="text-xs text-muted-foreground">
                                {invoice.billing_period} • Due: {invoice.due_date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <p className="font-semibold">
                                ${invoice.balance_due.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </p>
                              <Badge
                                className={
                                  invoice.payment_status === "overdue"
                                    ? "bg-destructive text-destructive-foreground font-bold"
                                    : invoice.payment_status === "due"
                                    ? "bg-warning text-warning-foreground font-bold"
                                    : "bg-muted text-muted-foreground"
                                }
                              >
                                {invoice.payment_status.toUpperCase()}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveInvoice(invoice.invoice_id)}
                              className="focus-ring"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-muted-foreground bg-muted/20 rounded p-2">
                      <strong>Attachments:</strong>{" "}
                      {accountInvoices.map(inv => inv.s3_object_key.split('/').pop()).join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="focus-ring"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="btn-gradient focus-ring"
            disabled={selectedInvoiceData.length === 0}
          >
            <Mail className="mr-2 h-4 w-4" />
            Confirm & Send {selectedInvoiceData.length} Email{selectedInvoiceData.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
