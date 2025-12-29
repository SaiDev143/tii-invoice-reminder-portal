import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

// const DISCLAIMER = `

// ---
// This is an automated email sent by the Technology Innovation Institute (TII) IT Cloud Team.
// For any issues or concerns, please contact: farookh.rangrej@tii.ae
// ---`;

//
// UPDATED TEMPLATES (department-level)
//
const TEMPLATES = {
  default: {
    name: "Default Reminder",
    body: `Dear [Department] Team,

This is a friendly reminder that your department currently has unpaid invoices.

Please review the attached invoice package for full details.`

  },

  overdue: {
    name: "Overdue Notice",
    body: `URGENT: Overdue Invoice Notice

Dear [Department] Team,

Our records show that your department has overdue invoices that require immediate attention.

The attached invoice package includes all overdue items associated with your accounts.

Immediate payment is required to avoid any service interruptions.

For assistance, contact: finance@tii.ae`

  },

  final: {
    name: "Final Notice",
    body: `FINAL NOTICE - Immediate Action Required

Dear [Department] Team,

This is the final notice regarding overdue invoices associated with your department.

Please review the attached invoice package for details.

Failure to remit payment within 5 business days may result in:
- Service suspension
- Collection agency referral
- Additional late fees

Contact us immediately: finance@tii.ae | +971-XXX-XXXX`

  },

  friendly: {
    name: "Friendly Reminder",
    body: `Hi [Department] Team,

Just a quick reminder that your department has pending invoices.

The attached package includes all related invoices grouped by account for your convenience.

If you need clarification or have already processed these, please let us know.

Warm regards,
TII Finance Team`
  },

  custom: {
    name: "Custom Template",
    body: `[Create your own template here]

Available placeholders:
[Department], [Payer Account ID]

*Invoice-level placeholders such as [Invoice ID] or [Amount] are not used
because this email sends a combined invoice package per department.`
  }
};

interface TemplateSelectorExtendedProps extends TemplateSelectorProps {
  customTemplateText?: string;
  onCustomTemplateChange?: (text: string) => void;
}

export const TemplateSelector = ({
  selectedTemplate,
  onTemplateChange,
  customTemplateText,
  onCustomTemplateChange
}: TemplateSelectorExtendedProps) => {
  const currentTemplate =
    TEMPLATES[selectedTemplate as keyof typeof TEMPLATES] || TEMPLATES.default;

  const isCustom = selectedTemplate === "custom";

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="text-lg">Email Template Selection</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose an email template for your reminder batch (disclaimer auto-added)
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Radio Buttons */}
        <RadioGroup value={selectedTemplate} onValueChange={onTemplateChange}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(TEMPLATES).map(([key, template]) => (
              <div key={key} className="flex items-center space-x-2">
                <RadioGroupItem value={key} id={key} className="focus-ring" />
                <Label htmlFor={key} className="font-normal cursor-pointer">
                  {template.name}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        {/* Template Preview or Custom Editor */}
        <div className="space-y-2">
          {isCustom ? (
            <>
              <Label htmlFor="custom-template-editor">Custom Template Editor</Label>
              <Textarea
                id="custom-template-editor"
                value={customTemplateText || ""}
                onChange={(e) => onCustomTemplateChange?.(e.target.value)}
                placeholder={`Type your custom message here...

Available placeholders:
[Department], [Payer Account ID]

The disclaimer will be automatically added at the end.`}
                className="min-h-[300px] font-mono text-sm focus-ring"
              />
              <p className="text-xs text-muted-foreground">
                Custom message will be used as-is. Disclaimer is automatically appended.
              </p>
            </>
          ) : (
            <>
              <Label htmlFor="template-preview">Template Preview (with Disclaimer)</Label>
              <Textarea
                id="template-preview"
                value={currentTemplate.body}
                readOnly
                className="min-h-[300px] font-mono text-sm bg-muted focus-ring"
              />
              <p className="text-xs text-muted-foreground">
                This is a department-level email. Placeholders will be filled automatically.
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { TEMPLATES};
