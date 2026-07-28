"use client";

import Header from "#/features/landing/Header";
import HeroSection from "#/features/landing/HeroSection";
import Features from "#/features/landing/Features";
import CTASection from "#/features/landing/CTASection";
import Footer from '#/features/landing/Footer';

export default function Home() {
  return (
    <div>
      {/*<Header />*/}
      <HeroSection />
      <Features />
      <CTASection />
      <Footer />
    </div>
  );
}
