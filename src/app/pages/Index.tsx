"use client";
import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
// import ToolsSection from "@/components/ToolsSection";
// import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      {/* <ToolsSection />
      <NewsSection /> */}
      <Footer />
    </div>
  );
};

export default Index;