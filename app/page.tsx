import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { WhyChoose } from "@/components/WhyChoose";
import { Credentials } from "@/components/Credentials";
import { Gallery } from "@/components/Gallery";
import { Process } from "@/components/Process";
import { ServiceArea } from "@/components/ServiceArea";
import { Reviews } from "@/components/Reviews";
import { QuoteSection } from "@/components/QuoteSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <WhyChoose />
      <Credentials />
      <Gallery />
      <Process />
      <ServiceArea />
      <Reviews />
      <QuoteSection />
    </>
  );
}
