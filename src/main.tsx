//src/main.tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./hero.css";
import "@/styles/loader.css";

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

export let msalInstance: PublicClientApplication; // ⭐ GLOBAL EXPORT

// Load config.json
async function loadConfig() {
  if (!window.__APP_CONFIG__) {
    const res = await fetch("/config.json");
    window.__APP_CONFIG__ = await res.json();
  }
}

// Create MSAL
function createMsalInstance() {
  const cfg = window.__APP_CONFIG__.azure.msalConfig;
  const inst = new PublicClientApplication(cfg);
  (window as any).msalInstance = inst;
  msalInstance = inst; // ⭐ Assign to exported variable
  return inst;
}

async function initApp() {
  await loadConfig();
  const instance = createMsalInstance();

  await instance.initialize();

  const redirectResult = await instance.handleRedirectPromise();
  if (redirectResult?.account) {
    instance.setActiveAccount(redirectResult.account);
  } else {
    const accounts = instance.getAllAccounts();
    if (accounts.length > 0) {instance.setActiveAccount(accounts[0]);}
  }

  const rootEl = document.getElementById("root")!;
  const root = createRoot(rootEl);

  root.render(
    <MsalProvider instance={instance}>
      <App />
    </MsalProvider>
  );
}

initApp();
