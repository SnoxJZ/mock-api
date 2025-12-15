'use client';

import { useState } from 'react';

import Link from 'next/link';

import MobileNavbar from './mobile-navbar';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <motion.header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between px-6 transition-all duration-300',
        isScrolled
          ? 'bg-background/60 border-border/40 border-b shadow-sm backdrop-blur-md'
          : 'bg-transparent',
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="font-mono text-lg font-bold tracking-tight">
            {'{ MockAPI }'}
          </Link>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            How it works
          </Link>
          <Link
            href="#pricing"
            data-testid="pricing-button"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="text-muted-foreground bg-secondary/50 border-border/50 hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium lg:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            All systems operational
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden md:inline-flex"
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" className="hidden font-semibold md:inline-flex">
              Start Free Trial
            </Button>
            <MobileNavbar />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
