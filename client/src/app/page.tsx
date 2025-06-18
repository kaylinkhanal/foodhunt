'use client'
import { NavigationMenuDemo } from '@/components/navbar'
import React from 'react'
import { useSelector } from 'react-redux'

const Home = () => {
  const {backgroundColor} = useSelector(state=>state.box)
  return (
    <div>
{backgroundColor}
      <NavigationMenuDemo/>
      Home</div>
  )
}

export default Home