import Sidebar from '@/components/sidebar'
import React from 'react'

const Layout = ({children}) => {
  return (
    <div >
        <div className='flex gap-2'>
        <Sidebar/>
        {children}
        </div>
  
        </div>
  )
}

export default Layout