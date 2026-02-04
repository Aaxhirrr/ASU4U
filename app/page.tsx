import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { ServicesSection } from "@/components/services-section"
import { FeaturesSection } from "@/components/features-section"
import { PricingSection } from "@/components/pricing-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div style={{ transform: 'scale(0.9)', transformOrigin: 'top center', width: '111.11%', marginLeft: '-5.55%' }}>
      <main className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <FeaturesSection />
        <CTASection />
        {/* <PricingSection /> */}
        <TestimonialsSection />
        <FAQSection />
        <Footer />
      </main>
    </div>
  )
}
