'use client';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container, Section } from '@/components/ui/section';

export function CTA() {
  return (
    <Section className="border-t border-zinc-200 bg-zinc-50/50 py-32 dark:border-zinc-800 dark:bg-zinc-900/50">
      <Container>
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Ready to stop waiting for Backend?
          </h2>
          <p className="text-muted-foreground max-w-[600px] md:text-xl">
            Join thousands of developers building faster with MockAPI. Start
            your free trial today, no credit card required.
          </p>
          <Button size="lg" className="h-12 px-8 text-base">
            Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Container>
    </Section>
  );
}
