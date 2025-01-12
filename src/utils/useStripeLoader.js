// useStripeLoader.js
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const useStripeLoader = (publishableKey) => {
  const [stripe, setStripe] = useState(null);
  const [loading, setLoading] = useState(true);
 console.log('stripe instance',stripe
 )
  useEffect(() => {
    if (!window.Stripe) {
      loadStripe(publishableKey).then(stripeInstance => {
        setStripe(stripeInstance);
        console.log('stripe instance loaded',stripeInstance)
        setLoading(false);
      }).catch(error => {
        console.error("Stripe loading failed:", error);
        setLoading(false);
      });
    } else {
      setStripe(window.Stripe(publishableKey));
      setLoading(false);
    }
  }, [publishableKey]);

  return [stripe, loading];
};

export default useStripeLoader;
