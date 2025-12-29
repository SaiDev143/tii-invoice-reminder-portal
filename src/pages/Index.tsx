import { useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/Hero/HeroSection";
import CapabilityCards from "@/components/Features/CapabilityCards";
import ProcessFlow from "@/components/HowItWorks/ProcessFlow";
import LoginForm from "@/components/Login/LoginForm";
import Footer from "@/components/Footer";
import FloatingAIBot from "@/components/FloatingAIBot";

// ✅ DEFINE PROPS TYPE
type IndexProps = {
  onAccessPortalClick: () => void;
};

const Index = ({ onAccessPortalClick }: IndexProps) => {
  const loginRef = useRef<HTMLDivElement>(null);

  const scrollToLogin = () => {
    document.getElementById("login")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="hero-theme min-h-screen bg-background">
      {/* Fixed Header */}
      <Header onLoginClick={scrollToLogin} />

      {/* Hero Section */}
      <HeroSection onLoginClick={scrollToLogin} />

      {/* Core Capabilities */}
      <CapabilityCards />

      {/* How It Works */}
      <div id="how-it-works">
        <ProcessFlow />
      </div>

      {/* Login Section */}
      <LoginForm
        id="login"
        onAccessPortalClick={onAccessPortalClick}
      />

      {/* Footer */}
      <Footer />

      {/* Floating AI Bot */}
      <FloatingAIBot onLoginClick={scrollToLogin} />
    </div>
  );
};

export default Index;
