import { ScanSearch, FolderKanban, FileOutput, Send, BrainCircuit, ChevronRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  {
    icon: ScanSearch,
    title: "Detect Invoices",
    description: "Automatically identifies due & overdue invoices",
  },
  {
    icon: FolderKanban,
    title: "Group by Department",
    description: "Organizes invoices by responsible department",
  },
  {
    icon: FileOutput,
    title: "Generate Package",
    description: "Creates summary with invoice attachments",
  },
  {
    icon: Send,
    title: "Send Reminders",
    description: "Dispatches emails automatically",
  },
  {
    icon: BrainCircuit,
    title: "AI Insights",
    description: "Assists with queries and analysis",
  },
];

function StepCard({ step, index, isLast }: { step: typeof steps[0]; index: number; isLast: boolean }) {
  const { ref, isInView } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div ref={ref} className="flex items-center">
      {/* Step Card */}
      <div
        className={`flex flex-col items-center text-center group transition-all duration-600 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
        style={{ transitionDelay: `${index * 120}ms` }}
      >
        {/* Step Number */}
        <div className="text-xs font-bold text-primary/60 mb-3 uppercase tracking-widest">
          Step {index + 1}
        </div>

        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl glass-card flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
          <step.icon className="w-9 h-9 text-primary" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {step.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground max-w-[140px]">
          {step.description}
        </p>
      </div>

      {/* Connector Arrow */}
      {!isLast && (
        <div 
          className={`mx-4 flex-shrink-0 transition-all duration-500 ${
            isInView ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: `${index * 120 + 60}ms` }}
        >
          <ChevronRight className="w-6 h-6 text-primary/40" />
        </div>
      )}
    </div>
  );
}

function MobileStepCard({ step, index, isLast }: { step: typeof steps[0]; index: number; isLast: boolean }) {
  const { ref, isInView } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={`flex items-start gap-4 transition-all duration-600 ${
        isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Step Number & Line */}
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center flex-shrink-0">
          <step.icon className="w-7 h-7 text-primary" />
        </div>
        {!isLast && (
          <div className="w-0.5 h-12 bg-gradient-to-b from-primary/30 to-transparent mt-2" />
        )}
      </div>

      {/* Content */}
      <div className="pt-2">
        <div className="text-xs font-bold text-primary/60 mb-1 uppercase tracking-widest">
          Step {index + 1}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {step.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export function ProcessFlow() {
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation<HTMLDivElement>();

  return (
    <section className="py-24 enterprise-gradient relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
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
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A streamlined process from invoice detection to reminder delivery.
          </p>
        </div>

        {/* Desktop Flow - Horizontal */}
        <div className="hidden lg:flex items-start justify-between gap-4 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <StepCard 
              key={step.title} 
              step={step} 
              index={index} 
              isLast={index === steps.length - 1} 
            />
          ))}
        </div>

        {/* Mobile/Tablet Flow - Vertical */}
        <div className="lg:hidden flex flex-col gap-6 max-w-md mx-auto">
          {steps.map((step, index) => (
            <MobileStepCard
              key={step.title}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProcessFlow;