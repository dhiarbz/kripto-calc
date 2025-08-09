"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calculator, TrendingUp, DollarSign, Pickaxe } from "lucide-react";

const ToolsSection = () => {
  const tools = [
    {
      icon: DollarSign,
      title: "Crypto to Rupiah Converter",
      description: "Convert any cryptocurrency to Indonesian Rupiah with real-time exchange rates and historical data.",
      features: ["Real-time rates", "Multiple coins", "Historical charts"],
      href: "/converter",
      color: "text-blue-600"
    },
    {
      icon: Calculator,
      title: "Position Size Calculator",
      description: "Calculate optimal position sizes based on your risk tolerance and account balance for better risk management.",
      features: ["Risk percentage", "Stop loss levels", "Account balance"],
      href: "/position-size",
      color: "text-purple-600"
    },
    {
      icon: TrendingUp,
      title: "Gain & Loss Calculator",
      description: "Analyze your trading performance with detailed profit/loss calculations and percentage returns.",
      features: ["P&L analysis", "Percentage returns", "Fee calculations"],
      href: "/gain-loss",
      color: "text-emerald-600"
    },
    {
      icon: Pickaxe,
      title: "ROI Mining & Staking",
      description: "Calculate returns on investment for mining operations and staking rewards with compound interest.",
      features: ["Mining profitability", "Staking rewards", "Compound interest"],
      href: "/roi-mining",
      color: "text-orange-600"
    }
  ];

  return (
    <section id="tools" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Crypto Risk & ROI Tools
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional-grade calculators designed for serious crypto traders and investors. 
            Make informed decisions with accurate calculations and real-time data.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {tools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <Card 
                key={tool.title}
                className="group hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2 bg-gradient-card border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-primary/10 ${tool.color} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {tool.title}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-muted-foreground text-base leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Key Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {tool.features.map((feature) => (
                        <span 
                          key={feature}
                          className="px-3 py-1 bg-accent text-accent-foreground text-sm rounded-full font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground font-semibold group-hover:shadow-glow transition-all duration-300"
                    onClick={() => window.location.href = tool.href}
                  >
                    Use Calculator
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-card p-8 rounded-3xl border border-border/50 shadow-card max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Need More Advanced Tools?
            </h3>
            <p className="text-muted-foreground mb-6">
              Get access to premium features, advanced analytics, and personalized trading insights.
            </p>
            <Button 
              size="lg"
              className="bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground font-semibold shadow-glow"
            >
              Upgrade to Pro
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;