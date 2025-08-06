import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function HousePlanRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the correct URL
    router.replace('/Architecture-House-Plan-CAD-Drawings');
  }, [router]);

  return null; // Don't render anything
}

// Server-side redirect
// No SSR needed - redirect handled in next.config.js for better performance
// This eliminates server cost for this route entirely
