import Hero from '@/components/Hero';
import ImageGeneratorDemo from '@/components/ImageGeneratorDemo';
import Features from '@/components/Features';
import Gallery from '@/components/GalleryPreview';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import CTASection from '@/components/CTASection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ImageGeneratorDemo />
      <Features />
      <Gallery />
      <Pricing />
      <FAQ />
      <CTASection />
    </>
  );
}
