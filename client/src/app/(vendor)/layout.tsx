import Sidebar from '@/components/sidebar'
import React from 'react'

const Layout = ({ children }) => {
  return (
    <div >
      <div className="flex h-screen">
        <aside className="w-64 bg-gray-800">
          {/* your sidebar */}
          <Sidebar />
        </aside>

        <main className="flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout