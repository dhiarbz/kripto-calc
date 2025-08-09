"use client";
import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Market from "@/components/Market";
import ToolsSection from "@/components/Tools";
import Footer from "@/components/Footer";

const Page = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Market />
      <ToolsSection />
      <Footer />
    </div>
  );
};

export default Page;