import { getPaymentInformation } from '@/service/api';
import useStripeLoader from '@/utils/useStripeLoader';
import { useRouter } from 'next/router'
import React, { useEffect, useReducer } from 'react'
import { useSelector } from 'react-redux';

export default function OrderListPage() {
    const router=useRouter();
    // const userData= useSelector((store)=>store.logininfo)
    // const userData=JSON.parse(sessionStorage.getItem('userData'));
    //  console.log('user Data',userData)

    useEffect(()=>{
          if((router.query.session_id && router.query.session_id.trim()!=='') && typeof window !==undefined){
            const userData=JSON.parse(sessionStorage.getItem('userData')) || {};
           console.log('user Data',userData)
            getPaymentInformation(userData?.id,router.query.session_id).then((res)=>{
              console.log('api res',res.data)
             }).catch((err)=>{
              console.log('error',err)
             })
          }
    },[router.query])
   
  return (
    <div>OrderListPage</div>
  )
}
