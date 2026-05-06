import { Benefits } from "@/components/public/Benefits";
import { FAQ } from "@/components/public/FAQ";
import { Footer } from "@/components/public/Footer";
import { Gallery } from "@/components/public/Gallery";
import { Hero } from "@/components/public/Hero";
import { Navbar } from "@/components/public/Navbar";
import { ProductSection } from "@/components/public/ProductSection";
import { Testimonials } from "@/components/public/Testimonials";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { ContactSection } from "@/components/public/ContactSection";
import { getLandingData } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const landing = await getLandingData();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero product={landing.product} config={landing.config} />
      <Benefits />
      <ProductSection product={landing.product} config={landing.config} />
      <Gallery />
      <Testimonials />
      <FAQ />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
