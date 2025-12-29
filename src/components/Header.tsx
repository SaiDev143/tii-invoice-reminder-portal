import tiiLogo from "@/assets/tii-logo.png";

interface HeaderProps {
  onLoginClick: () => void;
}

export function Header({ onLoginClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-3 group">
              <img
                src={tiiLogo}
                alt="Technology Innovation Institute"
                className="h-10 lg:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </a>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              How It Works
            </a>
            <a
              href="#login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("login")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Login
            </a>
          </nav>

          {/* CTA Button */}
          <button
            onClick={onLoginClick}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all duration-300"
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;