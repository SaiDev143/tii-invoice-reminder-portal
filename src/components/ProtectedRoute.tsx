import { useMsal } from "@azure/msal-react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: (user: any) => JSX.Element;
}) {
  const { instance, accounts } = useMsal();

  // Prefer active account (most reliable)
  const user = instance.getActiveAccount() || accounts[0] || null;

  // Not logged in → go to Hero
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in → allow access
  return children(user);
}
