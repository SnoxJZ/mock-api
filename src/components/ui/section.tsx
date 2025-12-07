import * as React from 'react';

import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, as: Component = 'section', ...props }, ref) => (
    <Component
      ref={ref}
      className={cn('container py-24', className)}
      {...props}
    />
  ),
);
Section.displayName = 'Section';

const Container = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-4 md:px-6', className)} {...props} />
));
Container.displayName = 'Container';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ title, description, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('space-y-4 text-center', className)}
      {...props}
    >
      {title && (
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-muted-foreground mx-auto max-w-[700px] md:text-xl">
          {description}
        </p>
      )}
      {children}
    </div>
  ),
);
SectionHeader.displayName = 'SectionHeader';

export { Container, Section, SectionHeader };
