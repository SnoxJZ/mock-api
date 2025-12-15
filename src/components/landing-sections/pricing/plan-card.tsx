'use client';

import { ReactNode } from 'react';

import { Check } from 'lucide-react';

import ViewInAnimate from '@/components/animation/view-in-animate';
import { Button, ButtonProps } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface PlanCardProps {
  title: string;
  price: ReactNode;
  priceSuffix?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant?: ButtonProps['variant'];
  footerNote?: string;
  isPopular?: boolean;
  popularText?: string;
  animationDelay?: number;
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
  dataTestId?: string;
}

export function PlanCard({
  title,
  price,
  priceSuffix = '/ month',
  description,
  features,
  buttonText,
  buttonVariant = 'outline',
  footerNote,
  isPopular = false,
  popularText = 'Most Popular',
  animationDelay = 0,
  className,
  onClick,
  isLoading,
  dataTestId,
}: PlanCardProps) {
  return (
    <ViewInAnimate
      delay={animationDelay}
      className={isPopular ? 'relative' : undefined}
    >
      {isPopular && (
        <div className="absolute -top-3 left-0 right-0 z-20 flex justify-center">
          <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-medium">
            {popularText}
          </span>
        </div>
      )}
      <Card
        className={cn(
          'flex h-full flex-col',
          isPopular
            ? 'border-primary relative z-10 bg-white shadow-lg dark:bg-zinc-950'
            : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950',
          className,
        )}
      >
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <div className="mt-2 flex items-baseline gap-1 text-3xl font-bold">
            {price}
            {priceSuffix && (
              <span className="text-muted-foreground text-sm font-normal">
                {priceSuffix}
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-2 text-sm">{description}</p>
        </CardHeader>
        <CardContent className="flex-1">
          <ul className="space-y-2 text-sm">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" /> {feature}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className={footerNote ? 'flex-col gap-2' : undefined}>
          <Button
            variant={buttonVariant}
            onClick={onClick}
            disabled={isLoading}
            className="w-full"
            data-testid={dataTestId}
          >
            {isLoading ? 'Redirecting...' : buttonText}
          </Button>
          {footerNote && (
            <p className="text-muted-foreground text-center text-xs">
              {footerNote}
            </p>
          )}
        </CardFooter>
      </Card>
    </ViewInAnimate>
  );
}
