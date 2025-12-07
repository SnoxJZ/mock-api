'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Container, Section, SectionHeader } from '@/components/ui/section';
import { faqItems } from '@/constants/landing-content';

export function FAQ() {
  return (
    <Section id="faq" className="space-y-12">
      <Container>
        <SectionHeader
          title="Frequently Asked Questions"
          description="Everything you need to know about MockAPI."
          className="mb-12"
        />

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </Section>
  );
}
