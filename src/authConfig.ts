// src/authConfig.ts

// Loads config from window.__APP_CONFIG__ (set in index.html)
export function getMsalConfig() {
  const cfg = window.__APP_CONFIG__;

  return {
    auth: {
      clientId: cfg.azure.clientId,
      authority: `https://login.microsoftonline.com/${cfg.azure.tenantId}`,
      redirectUri: cfg.azure.redirectUri,
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: false,
    }
  };
}

/**
 * Default login request for loginRedirect()
 * This MUST NOT include API scopes.
 */
export function getLoginRequest() {
  return {
    scopes: ["openid", "profile", "email"]
  };
}

/**
 * API access request to your backend API
 */
export function getApiRequest() {
  const cfg = window.__APP_CONFIG__;
  return {
    scopes: [cfg.azure.apiScope]
  };
}
