import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

import { toast } from 'sonner';

function PricingAlert() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('canceled')) {
      toast.error('Payment canceled', {
        description: "You haven't been charged. You can try again anytime.",
        duration: 5000,
      });
      const newUrl = window.location.pathname + '#pricing';
      window.history.replaceState(null, '', newUrl);
    }
  }, [searchParams]);

  return null;
}

export default PricingAlert;
