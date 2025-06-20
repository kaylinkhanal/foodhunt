'use client'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import navItems from '@/config/navItems.json'
import { Button } from './ui/button'
import { logoutUser } from '@/redux/reducerSlices/userSlice'
import { useRouter } from 'next/navigation'

const Sidebar = () => {
    const {role} = useSelector(state=>state.user)
    const dispatch = useDispatch()
    const router = useRouter()
    const handleLogout = ()=> {
        dispatch(logoutUser())
        router.push('/login')
    }
  return (
    <div>
        <div className='flex flex-col bg-gray-100 h-screen w-64 shadow-lg'>
        {role && navItems[role].map((item,id)=>{
            return (
                <Link href={item.path} key={id} className="block p-4 text-gray-700 hover:bg-gray-200">{item.label}</Link>

        )})}
        <Button onClick={handleLogout}>Logout</Button>
        </div>
          
    </div>
  )
}

export default Sidebar