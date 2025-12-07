'use client';

import { useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { Label } from '@/components/ui/label';
import { Container, Section, SectionHeader } from '@/components/ui/section';
import { Switch } from '@/components/ui/switch';

import { PlanCard } from '../plan-card';

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <Section id="pricing" className="space-y-12">
      <Container>
        <SectionHeader title="Simple pricing for developers" className="mb-8">
          <div className="flex items-center justify-center gap-4 pt-4">
            <Label
              htmlFor="billing-toggle"
              className={
                !isYearly ? 'text-primary font-bold' : 'text-muted-foreground'
              }
            >
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label
              htmlFor="billing-toggle"
              className={
                isYearly ? 'text-primary font-bold' : 'text-muted-foreground'
              }
            >
              Yearly{' '}
              <span className="ml-1 text-xs font-normal text-green-500">
                (-20%)
              </span>
            </Label>
          </div>
        </SectionHeader>

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-6 md:grid-cols-3 lg:gap-8">
          <PlanCard
            title="Hacker"
            price="$0"
            description="Perfect for pet projects"
            features={['5 Endpoints', '1,000 requests/mo', 'Static Data only']}
            buttonText="Get Started"
          />

          <PlanCard
            title="Pro Developer"
            price={<AnimatedPrice isYearly={isYearly} />}
            description="For serious development"
            features={[
              'Unlimited Endpoints',
              '10k requests/mo',
              'AI Generation (GPT-5)',
              'Chaos Mode',
            ]}
            buttonText="Start 14-day Trial"
            buttonVariant="default"
            footerNote="Cancel anytime"
            isPopular
            animationDelay={0.1}
          />

          <PlanCard
            title="Team"
            price="Contact Us"
            priceSuffix=""
            description="For companies"
            features={[
              'Custom Domain',
              'SSO & SAML',
              'SLA 99.9%',
              'Dedicated Support',
            ]}
            buttonText="Contact Sales"
            animationDelay={0.2}
            className="border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50"
          />
        </div>
      </Container>
    </Section>
  );
}

function AnimatedPrice({ isYearly }: { isYearly: boolean }) {
  return (
    <>
      $
      <div className="relative inline-block h-[1em] w-[2ch] translate-y-1 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {isYearly ? (
            <motion.span
              key="yearly"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.4, ease: 'circOut' }}
              className="absolute inset-0 text-center"
            >
              24
            </motion.span>
          ) : (
            <motion.span
              key="monthly"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.4, ease: 'circOut' }}
              className="absolute inset-0 text-center"
            >
              30
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
