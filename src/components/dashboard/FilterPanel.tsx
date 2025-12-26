// src/components/dashboard/FilterPanel.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import { FilterState, Invoice } from "@/pages/Dashboard";

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  invoices: Invoice[];
}

export const FilterPanel = ({ filters, onFiltersChange, invoices }: FilterPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // ✅ DEPARTMENTS MUST USE department_name
  const allDepartments = Array.from(
    new Set(invoices.map(inv => inv.department_name).filter(Boolean))
  );

  // ✅ ACCOUNTS
  const allAccounts = Array.from(
    new Set(invoices.map(inv => inv.account_name).filter(Boolean))
  );

  // When dept selected → show only accounts belonging to that dept
  const filteredAccounts =
    filters.departments.length > 0
      ? allAccounts.filter(acc =>
          invoices.some(
            inv =>
              inv.account_name === acc &&
              filters.departments.includes(inv.department_name)
          )
        )
      : allAccounts;

  // ✅ BILLING PERIOD
  const allBillingPeriods = Array.from(
    new Set(invoices.map(inv => inv.billing_period).filter(Boolean))
  );

  // Reset filters
  const handleReset = () => {
    onFiltersChange({
      accounts: [],
      departments: [],
      statuses: [],
      billingPeriods: []
    });
  };

  return (
    <Card className="dashboard-card">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button variant="ghost" size="sm">
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Department */}
            <div>
              <Label>Department</Label>
              <MultiSelect
                options={allDepartments.map(d => ({ label: d, value: d }))}
                selected={filters.departments}
                onChange={selected =>
                  onFiltersChange({
                    ...filters,
                    departments: selected,
                    accounts: [] // reset accounts
                  })
                }
              />
            </div>

            {/* Account */}
            <div>
              <Label>Account</Label>
              <MultiSelect
                options={filteredAccounts.map(a => ({ label: a, value: a }))}
                selected={filters.accounts}
                onChange={selected =>
                  onFiltersChange({ ...filters, accounts: selected })
                }
              />
            </div>

            {/* Status */}
            <div>
              <Label>Status</Label>
              <MultiSelect
                options={[
                  { label: "Due", value: "due" },
                  { label: "Overdue", value: "overdue" },
                  { label: "Paid", value: "paid" },
                  { label: "Total Unpaid", value: "total_unpaid" }
                ]}
                selected={filters.statuses}
                onChange={selected =>
                  onFiltersChange({ ...filters, statuses: selected })
                }
              />
            </div>

            {/* Billing Period */}
            <div>
              <Label>Billing Period</Label>
              <MultiSelect
                options={allBillingPeriods.map(p => ({ label: p, value: p }))}
                selected={filters.billingPeriods}
                onChange={selected =>
                  onFiltersChange({ ...filters, billingPeriods: selected })
                }
              />
            </div>
          </div>

          {/* Reset */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
