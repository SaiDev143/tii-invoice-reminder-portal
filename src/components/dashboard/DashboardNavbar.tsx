import { Building2, LogOut, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

export const DashboardNavbar = ({ user }: { user: any }) => {
  const { instance } = useMsal();

  // Extract user details safely
  const name = user?.name || "Unknown User";
  const email =
    user?.username ||
    user?.idTokenClaims?.preferred_username ||
    "";

  const role = "Finance User";

  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  /**
   * ✅ CORRECT LOGOUT FLOW
   * - Popup logout (no Microsoft picker)
   * - Clear active account
   * - Hard redirect to Hero page
   */
  const handleLogout = async () => {
    const account =
      instance.getActiveAccount() ??
      instance.getAllAccounts()[0] ??
      null;

    if (account) {
      await instance.logoutPopup({ account });
    }

    instance.setActiveAccount(null);

    // Force clean reload to Hero page
    window.location.replace("/");
  };

  return (
    <nav className="bg-card border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                Invoice Reminder Portal
              </h1>
              <p className="text-xs text-muted-foreground">
                Technology Innovation Institute
              </p>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center space-x-4">

            {/* Logs */}
            <Link to="/logs">
              <Button variant="ghost" size="sm" className="focus-ring">
                <FileText className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Logs</span>
              </Button>
            </Link>

            {/* User Info */}
            <div className="hidden md:flex items-center space-x-3">
              <Avatar className="h-9 w-9 border-2 border-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {role}
                </p>
              </div>
            </div>

            {/* Logout */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="focus-ring"
            >
              <LogOut className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>

          </div>
        </div>
      </div>
    </nav>
  );
};
