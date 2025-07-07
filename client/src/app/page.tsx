'use client'
import MapComponent from '@/components/map-component'
import Navbar from '@/components/navbar'
import React from 'react'
import { useSelector } from 'react-redux'

const Home = () => {
  return (
    <div>

      {/* <NavigationMenuDemo/> */}  
      
      {/* <Navbar /> */}
      <MapComponent/>
      
      
      </div>
  )
}

export default Home