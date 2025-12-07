'use client';

import * as React from 'react';

import confetti from 'canvas-confetti';
import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container, Section, SectionHeader } from '@/components/ui/section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { codeSnippets } from '@/constants/landing-content';
import { cn } from '@/lib/utils';

type Language = keyof typeof codeSnippets;

const languageLabels: Record<Language, string> = {
  curl: 'cURL',
  javascript: 'JavaScript',
  python: 'Python',
  axios: 'Axios',
};

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x, y },
        colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
        scalar: 0.8,
        gravity: 1.2,
        ticks: 100,
      });
    }

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg border border-zinc-200 bg-zinc-950 dark:border-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
        <span className="font-mono text-xs text-zinc-500">{language}</span>
        <Button
          ref={buttonRef}
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className={cn(
            'h-7 gap-1.5 px-2 text-xs transition-all',
            copied
              ? 'text-green-500 hover:text-green-500'
              : 'text-zinc-400 hover:text-zinc-900',
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>

      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-sm text-zinc-300">{code}</code>
      </pre>
    </div>
  );
}

export function CodeIntegration() {
  return (
    <Section id="code-integration" className="space-y-12">
      <Container>
        <SectionHeader
          title="Code Integration"
          description="Switch to MockAPI in one line. Works with any language or framework."
          className="mb-10"
        />

        <div className="mx-auto max-w-3xl">
          <Tabs defaultValue="javascript" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-4">
              {(Object.keys(codeSnippets) as Language[]).map((lang) => (
                <TabsTrigger
                  key={lang}
                  value={lang}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {languageLabels[lang]}
                </TabsTrigger>
              ))}
            </TabsList>

            {(Object.entries(codeSnippets) as [Language, string][]).map(
              ([lang, code]) => (
                <TabsContent key={lang} value={lang}>
                  <CodeBlock code={code} language={languageLabels[lang]} />
                </TabsContent>
              ),
            )}
          </Tabs>
        </div>
      </Container>
    </Section>
  );
}
