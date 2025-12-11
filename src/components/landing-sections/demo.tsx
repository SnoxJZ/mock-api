'use client';

import { useState } from 'react';

import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Container, Section, SectionHeader } from '@/components/ui/section';
import { Switch } from '@/components/ui/switch';
import { ERROR_RESPONSE, SUCCESS_RESPONSE } from '@/constants/landing-content';
import { renderHighlightedJson } from '@/lib/renderHighlitedJson';
import { cn } from '@/lib/utils';

export function Demo() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [isDelayEnabled, setIsDelayEnabled] = useState(false);
  const [isErrorEnabled, setIsErrorEnabled] = useState(false);

  const handleRequest = async () => {
    setIsLoading(true);
    setResponse(null);

    const delay = isDelayEnabled ? 2000 : 600;
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (isErrorEnabled) {
      setResponse(ERROR_RESPONSE);
    } else {
      setResponse(SUCCESS_RESPONSE);
    }
    setIsLoading(false);
  };

  return (
    <Section className="bg-zinc-50 dark:bg-zinc-900/50">
      <Container>
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <SectionHeader
            title="Try it right now."
            description="Experience the power of MockAPI without signing up."
          />
          <div className="w-full max-w-3xl space-y-6">
            <Card className="border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <div className="text-muted-foreground absolute left-3 top-2.5 rounded border border-zinc-200 bg-zinc-100 px-1.5 text-xs font-bold dark:border-zinc-700 dark:bg-zinc-800">
                      GET
                    </div>
                    <Input
                      readOnly
                      value="https://api.mock-api.com/v1/users"
                      className="bg-zinc-50 pl-14 font-mono text-sm dark:bg-zinc-900"
                    />
                  </div>
                  <Button
                    onClick={handleRequest}
                    disabled={isLoading}
                    className="w-full transition-all sm:w-[140px]"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Send Request'
                    )}
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 pt-2 sm:justify-start">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="delay-mode"
                      checked={isDelayEnabled}
                      onCheckedChange={setIsDelayEnabled}
                    />
                    <Label htmlFor="delay-mode">Simulate 2s Delay</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="error-mode"
                      checked={isErrorEnabled}
                      onCheckedChange={setIsErrorEnabled}
                    />
                    <Label htmlFor="error-mode">Random 500 Error</Label>
                  </div>
                </div>

                <div className="relative mt-4 min-h-[200px] overflow-hidden rounded-lg border border-zinc-200 bg-zinc-950 p-4 text-left dark:border-zinc-800">
                  <div className="absolute right-4 top-3 font-mono text-xs text-zinc-500">
                    JSON Response
                  </div>
                  <AnimatePresence mode="wait">
                    {response ? (
                      <motion.pre
                        key={response === ERROR_RESPONSE ? 'error' : 'success'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                          'max-h-[300px] overflow-auto whitespace-pre-wrap font-mono text-sm',
                        )}
                      >
                        <code>{renderHighlightedJson(response)}</code>
                      </motion.pre>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex h-full min-h-[160px] items-center justify-center font-mono text-sm text-zinc-500"
                      >
                        Waiting for request...
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
}
