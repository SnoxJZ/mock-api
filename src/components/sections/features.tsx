'use client';

import { motion } from 'motion/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container, Section, SectionHeader } from '@/components/ui/section';
import { features } from '@/constants/landing-content';

export function Features() {
  return (
    <Section id="features" className="space-y-12">
      <Container>
        <SectionHeader
          title="Killer Features"
          description="Everything you need to build robust frontend applications."
          className="mb-12"
        />

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial="idle"
              whileHover="hover"
              viewport={{ once: true }}
              variants={{
                idle: { y: 0 },
                hover: { y: -8 },
              }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full border-zinc-200 bg-zinc-50/50 transition-colors duration-300 hover:border-zinc-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700">
                <CardHeader>
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 ${feature.iconColor}`}
                  >
                    <motion.div variants={feature.variants}>
                      <feature.icon className="h-6 w-6" />
                    </motion.div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
