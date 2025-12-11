import { CodeIntegration } from '@/components/landing-sections/code-integration';
import { CTA } from '@/components/landing-sections/cta';
import { Demo } from '@/components/landing-sections/demo';
import { FAQ } from '@/components/landing-sections/faq';
import { Features } from '@/components/landing-sections/features';
import { Hero } from '@/components/landing-sections/hero';
import { Pricing } from '@/components/landing-sections/pricing';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <Demo />
      <Features />
      <CodeIntegration />
      <Pricing />
      <FAQ />
      <CTA />
    </main>
  );
}
