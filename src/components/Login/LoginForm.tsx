import { useState } from "react";
import { ArrowRight, ShieldCheck, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  id?: string;
  onAccessPortalClick: () => void;
}

export function LoginForm({ id, onAccessPortalClick }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSSOLogin = async () => {
    setIsLoading(true);

    try {
      // 🔐 REAL LOGIN — delegated to HeroPage (Azure AD / MSAL)
      onAccessPortalClick();

      // Optional UX toast (safe, no redirect blocking)
      toast({
        title: "Redirecting to Sign-In",
        description: "You are being redirected to your organization's login page.",
      });
    } catch (error) {
      toast({
        title: "Login Error",
        description:
          "Unable to start the sign-in process. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <section
      id={id}
      className="py-24 bg-background relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Secure Access
            </h2>
            <p className="text-muted-foreground">
              Access the Automated Reminder System
            </p>
          </div>

          {/* Login Card */}
          <div className="glass-card p-8 shadow-glass-lg">
            {/* SSO Login Button */}
            <Button
              onClick={handleSSOLogin}
              disabled={isLoading}
              className="w-full h-14 text-lg font-semibold rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 group animate-glow-pulse"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Redirecting…
                </div>
              ) : (
                <>
                  Login to Send Invoice Reminders
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            {/* Trust Badge */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>Secured with enterprise-grade encryption</span>
              </div>
            </div>
          </div>

          {/* Helper Text */}
          <p className="text-center text-xs text-muted-foreground/70 mt-6">
            Authentication is handled securely via the organization’s
            identity provider.
          </p>
        </div>
      </div>
    </section>
  );
}

export default LoginForm;
