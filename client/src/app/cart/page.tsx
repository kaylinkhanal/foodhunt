'use client'
import React from 'react'
import { useSelector } from 'react-redux'

const Cart = () => {
    const {cart} = useSelector(state=>state.product)
  return (
    <div>
        {JSON.stringify(cart)}
    </div>
  )
}

export default Cart