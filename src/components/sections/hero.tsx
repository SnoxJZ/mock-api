'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { motion } from 'motion/react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { jsonResponse } from '@/constants/landing-content';
import { renderHighlightedJson } from '@/lib/renderHighlitedJson';

import ViewInAnimate from '../animation/view-in-animate';

export function Hero() {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= jsonResponse.length) {
        setDisplayText(jsonResponse.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pb-16 pt-20 md:pb-24 md:pt-32">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            <ViewInAnimate
              className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              tag="h1"
            >
              Frontend is ready. <br />
              <span className="text-primary">Backend is not?</span>
            </ViewInAnimate>

            <ViewInAnimate
              className="text-muted-foreground max-w-[600px] text-lg sm:text-xl"
              delay={0.2}
              tag="p"
            >
              Mock your API in seconds. Generate realistic data, test 500 errors
              and network delays. AI schema generation, GraphQL and REST
              support. Don't block development.
            </ViewInAnimate>

            <ViewInAnimate
              className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row"
              delay={0.4}
            >
              <Button
                size="lg"
                className="h-12 w-full px-8 text-base sm:w-auto"
              >
                Create API Endpoint
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 w-full px-8 text-base sm:w-auto"
                asChild
              >
                <Link href="/docs">See Documentation</Link>
              </Button>
            </ViewInAnimate>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto w-full max-w-lg lg:mx-0"
          >
            <Card className="overflow-hidden border-zinc-800 bg-[#1e1e1e] shadow-2xl">
              <div className="flex items-center gap-2 border-b border-zinc-800 bg-[#252526] px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                <div className="ml-2 font-mono text-xs text-zinc-500">
                  bash — 80x24
                </div>
              </div>

              <div className="space-y-4 p-6 font-mono text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-400">
                    <span>➜</span>
                    <span className="text-blue-400">~</span>
                    <span>mock-api generate</span>
                  </div>
                  <Input
                    className="border-zinc-800 bg-zinc-900/50 font-mono text-zinc-300 focus-visible:ring-zinc-700"
                    value="User profile with avatar and bitcoin wallet"
                    readOnly
                  />
                </div>

                <div className="relative min-h-[350px] rounded-md border border-zinc-800 bg-zinc-900/50 p-4">
                  <pre className="whitespace-pre-wrap break-all text-zinc-300">
                    <code>{renderHighlightedJson(displayText)}</code>
                  </pre>
                  {isTyping && (
                    <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-zinc-500 align-middle" />
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
