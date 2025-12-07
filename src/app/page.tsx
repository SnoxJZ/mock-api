import { CodeIntegration } from '@/components/sections/code-integration';
import { CTA } from '@/components/sections/cta';
import { Demo } from '@/components/sections/demo';
import { FAQ } from '@/components/sections/faq';
import { Features } from '@/components/sections/features';
import { Hero } from '@/components/sections/hero';
import { Pricing } from '@/components/sections/pricing';

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
