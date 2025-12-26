// src/lib/api.ts

import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { getApiRequest } from "@/authConfig";

const API_BASE = window.__APP_CONFIG__.api.baseUrl;

// ------------------------------------------------------
// ✅ Safe MSAL getter — same pattern used everywhere
// ------------------------------------------------------
function getMsalInstance() {
  const inst = (window as any).msalInstance;
  if (!inst) {
    console.error("❌ MSAL not initialized yet (api.ts)");
    return null;
  }
  return inst;
}

// ------------------------------------------------------
// 🔐 Get Access Token
// ------------------------------------------------------
async function getToken() {
  const msal = getMsalInstance();
  if (!msal) throw new Error("MSAL not ready");

  const accounts = msal.getAllAccounts();
  if (accounts.length === 0) throw new Error("No active account");

  try {
    const response = await msal.acquireTokenSilent({
      ...getApiRequest(),
      account: accounts[0],
    });

    return response.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await msal.acquireTokenRedirect(getApiRequest());
    }
    throw error;
  }
}

// ------------------------------------------------------
// 🌐 GET Request
// ------------------------------------------------------
export async function apiGet(path: string) {
  const token = await getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ------------------------------------------------------
// 🌐 POST Request
// ------------------------------------------------------
export async function apiPost(path: string, body: unknown) {
  const token = await getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ------------------------------------------------------
// 📄 Invoice API Wrapper (UNCHANGED)
// ------------------------------------------------------
export const invoiceAPI = {
  list: () => apiGet("/invoices"),
  get: (id: string) => apiGet(`/invoices/${id}`),
  markPaid: (id: string) => apiPost(`/invoices/${id}/mark-paid`, {}),
};

// ------------------------------------------------------
// 🤖 Chat API Wrapper (UPDATED)
// ------------------------------------------------------
export const chatAPI = {
  // Send chat message (supports session-based memory)
  send: (message: string, sessionId?: string) =>
    apiPost("/chat", { message, sessionId }),

  // Close chat session (clears backend memory)
  closeChat: (sessionId: string) =>
    apiPost("/chat/close", { sessionId }),
};
