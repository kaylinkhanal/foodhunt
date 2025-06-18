'use client'
import { NavigationMenuDemo } from '@/components/navbar'
import React from 'react'
import { useSelector } from 'react-redux'

const Home = () => {
  const {email} = useSelector(state=>state.user)
  return (
    <div>
{email}
      <NavigationMenuDemo/>
      Home</div>
  )
}

export default Home