import { FileText, AlertCircle, Clock, CheckCircle2, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardsProps {
  stats: {
    total: number;
    paid: number;
    due: number;
    overdue: number;
    totalUnpaid: number;
  };
}

export const DashboardCards = ({ stats }: DashboardCardsProps) => {
  const cards = [
    {
      title: "Total Invoices",
      value: stats.total,
      icon: FileText,
      color: "text-primary",
      bgHover: "hover:bg-primary/10",
      delay: "delay-100"
    },
    {
      title: "Paid Invoices",
      value: stats.paid,
      icon: CheckCircle2,
      color: "text-success",
      bgHover: "hover:bg-success/10",
      delay: "delay-200"
    },
    {
      title: "Total Unpaid (Due + Overdue)",
      value: stats.totalUnpaid,
      icon: Wallet,
      color: "text-warning",
      bgHover: "hover:bg-warning/10",
      delay: "delay-300"
    },
    {
      title: "Due Invoices",
      value: stats.due,
      icon: Clock,
      color: "text-yellow-500",
      bgHover: "hover:bg-yellow-500/10",
      delay: "delay-400"
    },
    {
      title: "Overdue Invoices",
      value: stats.overdue,
      icon: AlertCircle,
      color: "text-destructive",
      bgHover: "hover:bg-destructive/10",
      delay: "delay-500",
      accent: true
    }
  ];

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((card, index) => (
          <Card
            key={index}
            className={`dashboard-card animate-fade-in-up ${card.delay} ${card.bgHover} relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
          >
            {card.accent && (
              <div className="absolute top-0 right-0 w-20 h-20 bg-destructive/10 rounded-bl-full animate-pulse" />
            )}

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`h-6 w-6 ${card.color} transition-all duration-300 hover:scale-125`} />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
