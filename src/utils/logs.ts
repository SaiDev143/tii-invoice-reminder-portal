// utils/logs.ts
import { v4 as uuidv4 } from "uuid";

// ==========================
// EmailResult interface
// ==========================
export interface EmailResult {
  invoice_id: string;
  status: string; // "sent" | "failed"
  ses_message_id?: string | null;
  error_message?: string | null;
  timestamp: string;
}

// ==========================
// EmailLog interface
// ==========================
export interface EmailLog {
  log_id: string;
  timestamp: string;

  departments_selected: string[];
  accounts_selected: string[];
  statuses_selected: string[];
  billing_periods_selected: string[];

  template_used: string;
  total_invoices_sent: number;

  invoice_ids: string[];
  sent_by: string;

  email_content?: string;
  attachments?: string[];

  // NEW FIELD (optional for backward compatibility)
  email_results?: EmailResult[];   
}

// -----------------------------
// SAFE GLOBAL MSAL ACCESS
// -----------------------------
function getMsalInstance() {
  const inst = (window as any).msalInstance;
  if (!inst) {
    console.error("❌ MSAL not initialized yet");
    return null;
  }
  return inst;
}

// Generate unique log ID
export const generateLogId = (): string => {
  return `LOG-${Date.now()}-${uuidv4().slice(0, 8)}`;
};

// -----------------------------
// SAVE LOG TO BACKEND (POST)
// -----------------------------
export const savelog = async (log: EmailLog): Promise<void> => {
  const msal = getMsalInstance();
  if (!msal) return;

  // Ensure minimal fields
  log.log_id = log.log_id || generateLogId();
  log.timestamp = log.timestamp || new Date().toISOString();

  try {
    const token = await msal.acquireTokenSilent({
      scopes: [window.__APP_CONFIG__.azure.apiScope],
      account: msal.getActiveAccount(),
    });

    const apiBase = window.__APP_CONFIG__.api.baseUrl.replace(/\/api$/, "");

    const res = await fetch(`${apiBase}/api/logs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(log),
    });

    if (!res.ok) {
      console.error("❌ Failed to save log:", await res.text());
      return;
    }

    console.log("✅ Log saved:", log.log_id);
  } catch (err) {
    console.error("❌ savelog error:", err);
  }
};

// -----------------------------
// LOAD ALL LOGS FROM BACKEND (GET)
// -----------------------------
export const getLogs = async (): Promise<EmailLog[]> => {
  const msal = getMsalInstance();
  if (!msal) return [];

  try {
    const token = await msal.acquireTokenSilent({
      scopes: [window.__APP_CONFIG__.azure.apiScope],
      account: msal.getActiveAccount(),
    });

    const apiBase = window.__APP_CONFIG__.api.baseUrl.replace(/\/api$/, "");

    const res = await fetch(`${apiBase}/api/logs`, {
      headers: { Authorization: `Bearer ${token.accessToken}` },
    });

    if (!res.ok) {
      console.error("❌ Failed to load logs:", await res.text());
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("❌ getLogs error:", err);
    return [];
  }
};
