import { AnimatePresence, motion } from 'motion/react';

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

export default AnimatedPrice;
