"use client"

import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { logoutUser } from "@/redux/reducerSlices/userSlice"
import { useRouter } from "next/navigation"
import   navItems from '@/config/navItems.json'
import {
  BarChart3,
  Package,
  ShoppingCart,
  DollarSign,
  LogOut,
} from "lucide-react"
import Image from "next/image"
import { Button } from "./ui/button"

const Sidebar = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const {role} = useSelector(state=>state.user)
    const handleLogout = () => {
    dispatch(logoutUser())
    router.push("/login")
  }

  // const navItems = [
  //   { label: "Dashboard", path: "/seller/dashboard", icon: BarChart3 },
  //   { label: "Products", path: "/seller/products", icon: Package },
  //   { label: "Orders", path: "/seller/orders", icon: ShoppingCart },
  //   { label: "Revenue", path: "/seller/revenue", icon: DollarSign },
  // ]

  return (
    <div className="flex flex-col h-screen w-64 bg-white shadow-xl border-r border-orange-100">
      <div className="flex items-center justify-center p-6 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="flex items-center gap-3">
          <div
  style={{
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: 'white', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <Image
    src="/applogo.png"
    alt="App Logo"
    width={60}
    height={60}
    style={{ objectFit: 'cover' }}
  />
</div>

          <h1 className="text-2xl font-bold text-white tracking-wide">
            Food Hunt
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems[role]?.map(({ label, path, icon: Icon }, id) => (
          <Link
            key={id}
            href={path}
            className="group flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-orange-50 hover:text-orange-600 transition-all"
          >
            {/* <Icon className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors" /> */}
            <span>{label}</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-orange-100">
        <Button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}

export default Sidebar
