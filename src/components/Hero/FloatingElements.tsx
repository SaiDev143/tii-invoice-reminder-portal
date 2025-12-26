import { Mail, Clock, Cloud, Shield, Brain, Zap, Server, FileText, Database, Lock } from "lucide-react";

interface FloatingIconProps {
  icon: React.ReactNode;
  className?: string;
  delay?: string;
  size?: "sm" | "md" | "lg";
}

function FloatingIcon({ icon, className = "", delay = "0s", size = "md" }: FloatingIconProps) {
  const sizeClasses = {
    sm: "w-10 h-10 p-2.5",
    md: "w-12 h-12 p-3",
    lg: "w-14 h-14 p-3.5",
  };

  return (
    <div
      className={`
        absolute glass-card ${sizeClasses[size]}
        flex items-center justify-center
        text-primary/60 
        transition-all duration-700 hover:scale-110 hover:text-primary
        ${className}
      `}
      style={{ 
        animationDelay: delay,
        animation: `float-gentle 8s ease-in-out infinite ${delay}`
      }}
    >
      {icon}
    </div>
  );
}

export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* AWS-Inspired Grid Layout - Left Column */}
      <div className="absolute left-[5%] sm:left-[8%] top-[15%] flex flex-col gap-6">
        <FloatingIcon
          icon={<Mail className="w-full h-full" />}
          delay="0s"
          size="lg"
        />
        <FloatingIcon
          icon={<Clock className="w-full h-full" />}
          delay="0.5s"
          size="md"
        />
        <FloatingIcon
          icon={<FileText className="w-full h-full" />}
          delay="1s"
          size="sm"
        />
      </div>

      {/* Left Column - Lower */}
      <div className="absolute left-[12%] sm:left-[18%] top-[50%] flex flex-col gap-5">
        <FloatingIcon
          icon={<Brain className="w-full h-full" />}
          delay="1.5s"
          size="md"
        />
        <FloatingIcon
          icon={<Database className="w-full h-full" />}
          delay="2s"
          size="sm"
        />
      </div>

      {/* AWS-Inspired Grid Layout - Right Column */}
      <div className="absolute right-[5%] sm:right-[8%] top-[12%] flex flex-col gap-6">
        <FloatingIcon
          icon={<Cloud className="w-full h-full" />}
          delay="0.3s"
          size="lg"
        />
        <FloatingIcon
          icon={<Shield className="w-full h-full" />}
          delay="0.8s"
          size="md"
        />
        <FloatingIcon
          icon={<Lock className="w-full h-full" />}
          delay="1.3s"
          size="sm"
        />
      </div>

      {/* Right Column - Lower */}
      <div className="absolute right-[12%] sm:right-[18%] top-[52%] flex flex-col gap-5">
        <FloatingIcon
          icon={<Server className="w-full h-full" />}
          delay="1.8s"
          size="md"
        />
        <FloatingIcon
          icon={<Zap className="w-full h-full" />}
          delay="2.3s"
          size="sm"
        />
      </div>

      {/* Decorative gradient orbs - subtle purple glows */}
      <div 
        className="absolute top-[15%] left-[20%] w-80 h-80 bg-primary/[0.04] rounded-full blur-3xl"
        style={{ animation: "pulse-subtle 6s ease-in-out infinite" }}
      />
      <div 
        className="absolute bottom-[20%] right-[15%] w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl"
        style={{ animation: "pulse-subtle 8s ease-in-out infinite 2s" }}
      />
      <div 
        className="absolute top-[50%] left-[40%] w-64 h-64 bg-purple-500/[0.02] rounded-full blur-3xl"
        style={{ animation: "pulse-subtle 7s ease-in-out infinite 4s" }}
      />

      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
    </div>
  );
}

export default FloatingElements;