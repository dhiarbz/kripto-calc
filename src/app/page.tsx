"use client";
import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Tools from "@/components/Tools";
// import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";

const Page = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Tools />
      <Footer />
    </div>
  );
};

export default Page;