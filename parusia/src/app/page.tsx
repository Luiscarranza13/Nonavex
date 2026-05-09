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
import { UsageSection } from "@/components/public/UsageSection";
import { TrustStrip } from "@/components/public/TrustStrip";
import { MotionRuntime } from "@/components/animations/MotionRuntime";
import { getLandingData } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const landing = await getLandingData();
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: landing.product.nombre,
    description: landing.product.descripcion,
    image: landing.product.imagen,
    brand: {
      "@type": "Brand",
      name: "Novanex",
    },
    offers: {
      "@type": "Offer",
      price: landing.product.precio,
      priceCurrency: "PEN",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <MotionRuntime />
      <Navbar />
      <Hero product={landing.product} config={landing.config} />
      <TrustStrip />
      <Benefits />
      <ProductSection product={landing.product} config={landing.config} />
      <UsageSection />
      <Gallery />
      <Testimonials />
      <FAQ />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
