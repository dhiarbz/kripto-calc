"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";
import heroImage from "@/assets/hero-trading.jpg";

const Hero = () => {
    return (
         <section id="home" className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage.src} 
          alt="Trading Background" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-hero/80" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Master Your
                <span className="bg-primary bg-clip-text text-transparent"> Crypto Trading</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Comprehensive tools for cryptocurrency traders. Calculate positions, analyze risks, 
                and maximize your ROI with our professional trading calculators.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-2 bg-brand-accent/50 px-4 py-2 rounded-full">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">ROI Calculator</span>
              </div>
              <div className="flex items-center space-x-2 bg-brand-accent/50 px-4 py-2 rounded-full">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Risk Management</span>
              </div>
              <div className="flex items-center space-x-2 bg-brand-accent/50 px-4 py-2 rounded-full">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Instant Results</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow"
              >
                Start Calculating
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary/30 text-foreground hover:bg-accent"
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground">50M+</div>
                <div className="text-sm text-muted-foreground">Calculations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground">99.9%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div> */}
          </div>

          {/* Visual Element */}
          <div className="relative lg:block hidden">
            <div className="relative w-full h-96 animate-slide-up">
              <div className="absolute inset-0 bg-card rounded-3xl shadow-card border border-border/50 backdrop-blur-sm">
                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Live Trading Data</h3>
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce-gentle"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-accent/50 rounded-lg">
                      <span className="text-muted-foreground">BTC/IDR</span>
                      <span className="text-lg font-bold text-foreground">1,458,750,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-accent/50 rounded-lg">
                      <span className="text-muted-foreground">ETH/IDR</span>
                      <span className="text-lg font-bold text-foreground">58,920,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-accent/50 rounded-lg">
                      <span className="text-muted-foreground">Portfolio Value</span>
                      <span className="text-lg font-bold text-primary">+15.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    );
};

export default Hero;