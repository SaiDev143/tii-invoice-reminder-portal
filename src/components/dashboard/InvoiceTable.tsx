import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Invoice } from "@/pages/Dashboard";

interface InvoiceTableProps {
  invoices: Invoice[];
  selectedInvoices: string[];
  onSelectionChange: (selected: string[]) => void;
  onSort: (column: keyof Invoice) => void;
  sortColumn: keyof Invoice | null;
  sortDirection: "asc" | "desc";
}

export const InvoiceTable = ({
  invoices,
  selectedInvoices,
  onSelectionChange,
  onSort,
  sortColumn,
  sortDirection
}: InvoiceTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = invoices.slice(startIndex, startIndex + itemsPerPage);

  // Select all across ALL pages
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(invoices.map(inv => inv.invoice_id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedInvoices, invoiceId]);
    } else {
      onSelectionChange(selectedInvoices.filter(id => id !== invoiceId));
    }
  };

  const getStatusBadge = (status: Invoice["payment_status"]) => {
    const variants = {
      paid: "bg-success text-success-foreground font-bold",
      unpaid: "bg-muted text-muted-foreground font-bold",
      due: "bg-warning text-warning-foreground font-bold",
      overdue: "bg-destructive text-destructive-foreground font-bold"
    };

    return (
      <Badge className={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const allSelected = invoices.every(inv => 
    selectedInvoices.includes(inv.invoice_id)
  );

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="text-lg">Invoice List</CardTitle>
        <p className="text-sm text-muted-foreground">
          <strong>{selectedInvoices.length}</strong> of <strong>{invoices.length}</strong> invoices selected
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all invoices"
                  />
                </th>
                <th className="text-left p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSort("invoice_id")}
                    className="font-semibold focus-ring"
                  >
                    Invoice ID
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-left p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSort("account_name")}
                    className="font-semibold focus-ring"
                  >
                    Account
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-left p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSort("billing_period")}
                    className="font-semibold focus-ring"
                  >
                    Period
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-left p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSort("due_date")}
                    className="font-semibold focus-ring"
                  >
                    Due Date
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-right p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSort("balance_due")}
                    className="font-semibold focus-ring"
                  >
                    Balance
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-left p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSort("payment_status")}
                    className="font-semibold focus-ring"
                  >
                    Status
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-left p-3">
                  <span className="font-semibold">Provider</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.map((invoice) => (
                <tr
                  key={invoice.invoice_id}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="p-3">
                    <Checkbox
                      checked={selectedInvoices.includes(invoice.invoice_id)}
                      onCheckedChange={(checked) => 
                        handleSelectInvoice(invoice.invoice_id, checked as boolean)
                      }
                      aria-label={`Select invoice ${invoice.invoice_id}`}
                    />
                  </td>
                  <td className="p-3 font-mono text-sm">{invoice.invoice_id}</td>
                  <td className="p-3 font-medium">{invoice.account_name}</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {invoice.billing_period}
                  </td>
                  <td className="p-3 text-sm">{invoice.due_date}</td>
                  <td className="p-3 text-right font-semibold">
                    ${invoice.balance_due.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3">{getStatusBadge(invoice.payment_status)}</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {invoice.service_provider}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, invoices.length)} of {invoices.length}
          </p>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="focus-ring"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="focus-ring"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
