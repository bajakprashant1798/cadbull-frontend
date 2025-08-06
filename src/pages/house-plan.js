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
export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/Architecture-House-Plan-CAD-Drawings',
      permanent: true, // 301 redirect
    },
  };
}
