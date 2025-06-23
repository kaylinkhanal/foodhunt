'use client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import axios from 'axios'
import { AlertCircleIcon, PopcornIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Dashboard = () => {

  const [kycStatus, setKycStatus] = useState({})
  const fetchKycStatus = async () => {
    const {data}= await axios.get(process.env.NEXT_PUBLIC_API_URL+ '/kycs/684f830c0bed0edb979279fc')
    setKycStatus(data)
  }
  useEffect(()=>{
    fetchKycStatus()
  },[])

  return (
    <div>Dashboard
 
        {kycStatus?.isKycSubmitted && !kycStatus.isKycApproved && (
          <div>
             <Alert>
            <PopcornIcon />
            <AlertTitle>
              KYC is under review!! Please wait for approval.
            </AlertTitle>
          </Alert>
            </div>
        )} 

    {!kycStatus?.isKycSubmitted && !kycStatus.isKycApproved && (
          <div>
       <Alert >
        <AlertCircleIcon />
        <AlertTitle className='text-yellow-500'>Please fil in your KYC details.</AlertTitle>
        <AlertDescription>
          <p className='text-yellow-500'>Click here</p>
        </AlertDescription>
      </Alert>
            </div>
        )} 
 
    </div>
  )
}

export default Dashboard