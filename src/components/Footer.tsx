import { Shield, Server, Lock } from "lucide-react";
import tiiLogo from "@/assets/tii-logo.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/30 border-t border-border/50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Statement */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Server className="w-5 h-5 text-primary" />
            <span className="text-sm">Built on AWS</span>
          </div>
          <div className="w-px h-4 bg-border/50 hidden sm:block" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm">Enterprise-Grade Security</span>
          </div>
          <div className="w-px h-4 bg-border/50 hidden sm:block" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lock className="w-5 h-5 text-primary" />
            <span className="text-sm">Full Audit Logging</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mb-10" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo - matches header styling */}
          <div className="flex items-center gap-3">
            <img
              src={tiiLogo}
              alt="Technology Innovation Institute"
              className="h-10 lg:h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center">
            © {currentYear} Technology Innovation Institute. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;