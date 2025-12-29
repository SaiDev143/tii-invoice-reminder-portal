import { MousePointerClick, Package, AlertCircle, Bot, ShieldCheck } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const capabilities = [
  {
    icon: MousePointerClick,
    title: "One-Click Reminder Dispatch",
    description: "Instantly send due and overdue invoice reminder emails to all departments with a single action.",
  },
  {
    icon: Package,
    title: "Automated Email Packaging",
    description: "Invoices are automatically grouped, compressed, and attached to reminder emails for easy reference.",
  },
  {
    icon: AlertCircle,
    title: "Smart Due & Overdue Detection",
    description: "Intelligent system automatically identifies overdue and upcoming invoices in real-time.",
  },
  {
    icon: Bot,
    title: "Built-In AI Assistant",
    description: "Ask questions like \"Which departments have overdue invoices?\" or \"Show unpaid invoices for this month.\"",
    queries: [
      "Which departments have overdue invoices?",
      "Show unpaid invoices for this month",
      "Why is this invoice overdue?",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Secure & Controlled Access",
    description: "Only authorized users can trigger reminders and access sensitive invoice data.",
  },
];

function CapabilityCard({ capability, index }: { capability: typeof capabilities[0]; index: number }) {
  const { ref, isInView } = useScrollAnimation<HTMLDivElement>({ threshold: 0.15 });

  return (
    <div
      ref={ref}
      className={`group glass-card p-6 lg:p-8 card-3d hover:shadow-card-hover transition-all duration-500 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ 
        transitionDelay: `${index * 100}ms`
      }}
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
        <capability.icon className="w-7 h-7 text-primary" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-foreground mb-3">
        {capability.title}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed">
        {capability.description}
      </p>

      {/* AI Query Examples */}
      {capability.queries && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            Example Queries
          </p>
          <div className="flex flex-wrap gap-2">
            {capability.queries.map((query) => (
              <span
                key={query}
                className="text-xs px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium"
              >
                "{query}"
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function CapabilityCards() {
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation<HTMLDivElement>();

  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Core Capabilities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to automate invoice reminder workflows at enterprise scale.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {capabilities.map((capability, index) => (
            <CapabilityCard key={capability.title} capability={capability} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CapabilityCards;