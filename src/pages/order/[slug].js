import { useRouter } from 'next/router'
import React from 'react'

export default function PamentInformation() {
  const router=useRouter();
   const slug= router.query;
  return (
    <>
    <div>
      Order detail page
    </div>
    
    </>
  )
}
