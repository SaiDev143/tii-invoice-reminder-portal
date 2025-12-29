import { Suspense } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParticleBackground from "./ParticleBackground";
import FloatingElements from "./FloatingElements";

interface HeroSectionProps {
  onLoginClick: () => void;
}

export function HeroSection({ onLoginClick }: HeroSectionProps) {
  return (
    <section className="hero-theme relative min-h-screen flex items-center justify-center overflow-hidden enterprise-gradient mesh-gradient">
      {/* Three.js Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
        <ParticleBackground />
      </Suspense>

      {/* Floating CSS Elements */}
      <FloatingElements />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">
              Enterprise-Grade Automation Platform
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            Automated Due & OverDue
            <br />
            <span className="text-gradient-primary">Invoice Reminders</span>
            <br />
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-semibold text-muted-foreground">
              One Click. Zero Follow-ups.
            </span>
          </h1>

          {/* Sub-heading */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
            Send accurate due and overdue invoice reminders to departments instantly — with a single click — powered by automated workflows and an AI assistant.
          </p>

          {/* Highlighted One-Liner */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20 mb-10 animate-fade-in-up opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <p className="text-sm sm:text-base font-medium text-foreground">
              From invoice detection to reminder delivery — fully automated in one action.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up opacity-0" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
            <Button
              size="lg"
              onClick={onLoginClick}
              className="group h-14 px-8 text-lg font-semibold rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300"
            >
              Login to Send Reminders
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hero-outline-btn h-14 px-8 text-lg font-semibold rounded-xl animate-fade-in-up opacity-0"
              style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
            >
              Explore Features
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-muted-foreground animate-fade-in-up opacity-0" style={{ animationDelay: "600ms", animationFillMode: "forwards" }}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-sm">AWS Infrastructure</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-sm">Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-sm">SOC 2 Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

export default HeroSection;