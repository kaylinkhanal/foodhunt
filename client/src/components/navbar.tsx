"use client"

import { Search, ShoppingBag, User, MapPin, Clock, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useDispatch, useSelector } from "react-redux"
import { logoutUser } from "@/redux/reducerSlices/userSlice"

const foodCategories = {
  nonVeg: [
    { name: "Chicken", items: ["Grilled Chicken", "Chicken Curry", "Fried Chicken", "Chicken Biryani"] },
    { name: "Mutton", items: ["Mutton Curry", "Mutton Biryani", "Grilled Mutton", "Mutton Kebab"] },
    { name: "Pork", items: ["Pork Ribs", "Pork Curry", "Bacon", "Pork Chops"] },
    { name: "Fish", items: ["Fish Curry", "Grilled Fish", "Fish Fry", "Fish Biryani"] },
  ],
  veg: [
    { name: "Traditional Nepali", items: ["Dal Bhat", "Gundruk", "Aloo Tama","Dhido"] },
    { name: "Newari Cuisine", items: ["Bara", "Chatamari", "Yomari","Kwati"] },
    { name: "Chinese", items: ["Veg Fried Rice", "Chow Mein", "Manchurian", "Spring Rolls"] },
    { name: "Snacks & Street Food", items: ["Sel Roti", "Samosa", "Pani Puri","Jeri"] },
  ],
}

const drinks = [
  { name: "Hot Beverages", items: ["Coffee", "Tea", "Hot Chocolate", "Masala Chai"] },
  { name: "Cold Beverages", items: ["Fresh Juice", "Smoothies", "Iced Coffee", "Mocktails"] },
  { name: "Soft Drinks", items: ["Coke", "Pepsi", "Sprite", "Fanta"] },
  { name: "Healthy Drinks", items: ["Green Tea", "Herbal Tea", "Coconut Water", "Lemon Water"] },
]

const bestDeals = [
  { name: "Flash Sale", discount: "50% OFF", time: "2 hours left" },
  { name: "Combo Meals", discount: "Buy 1 Get 1", time: "Today only" },
  { name: "Happy Hours", discount: "30% OFF", time: "4-7 PM" },
]

export default function Navbar() {
  const {isLoggedIn} = useSelector(state=>state.user)
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logoutUser())
  }
  return (
    <header className="sticky top-0 z-999 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/applogo.png"
              alt="FoodHunt Logo"
              width={120}
              height={40}
              className="h-20 w-auto"
            />
          </Link>


          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium">Food</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[800px] grid-cols-2 gap-6 p-6">

                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-red-600">Non Veg</h3>
                      <div className="grid gap-4">
                        {foodCategories.nonVeg.map((category) => (
                          <div key={category.name}>
                            <h4 className="mb-2 font-medium text-orange-600">{category.name}</h4>
                            <div className="grid gap-1">
                              {category.items.map((item) => (
                                <NavigationMenuLink key={item} asChild>
                                  <Link
                                    href={`/food/${item.toLowerCase().replace(/\s+/g, "-")}`}
                                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                  >
                                    {item}
                                  </Link>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-green-600">Veg</h3>
                      <div className="grid gap-4">
                        {foodCategories.veg.map((category) => (
                          <div key={category.name}>
                            <h4 className="mb-2 font-medium text-orange-600">{category.name}</h4>
                            <div className="grid gap-1">
                              {category.items.map((item) => (
                                <NavigationMenuLink key={item} asChild>
                                  <Link
                                    href={`/food/${item.toLowerCase().replace(/\s+/g, "-")}`}
                                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                  >
                                    {item}
                                  </Link>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium">Drinks</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 gap-6 p-6">
                    {drinks.map((category) => (
                      <div key={category.name}>
                        <h4 className="mb-3 font-medium text-orange-600">{category.name}</h4>
                        <div className="grid gap-1">
                          {category.items.map((item) => (
                            <NavigationMenuLink key={item} asChild>
                              <Link
                                href={`/drinks/${item.toLowerCase().replace(/\s+/g, "-")}`}
                                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                              >
                                {item}
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent> 
              </NavigationMenuItem>

              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium text-orange-600">
                  <Star className="mr-1 h-4 w-4" />
                  Best Deals Today
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] p-6">
                    <h3 className="mb-4 text-lg font-semibold text-orange-600">Today's Special Offers</h3>
                    <div className="grid gap-4">
                      {bestDeals.map((deal) => (
                        <NavigationMenuLink key={deal.name} asChild>
                          <Link
                            href="/deals"
                            className="flex items-center justify-between rounded-lg border p-4 hover:bg-orange-50"
                          >
                            <div>
                              <h4 className="font-medium text-gray-900">{deal.name}</h4>
                              <p className="text-sm text-gray-600 flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {deal.time}
                              </p>
                            </div>
                            <Badge variant="destructive" className="bg-orange-500">
                              {deal.discount}
                            </Badge>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/restaurants"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Restaurants
                  </Link>
                </NavigationMenuLink>

              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>


          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input type="search" placeholder="Search food nearby..." className="pl-10 pr-4 w-full" />
              <Button size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7">
                <MapPin className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
            </Button>
           {isLoggedIn ? (

            <div>
         <Button onClick={handleLogout} variant="outline" className="justify-start bg-black hover:bg-[#c74021] text-blue-50">
               Sign In
            </Button>
              </div>
           ): <div className="flex flex-row items-center space-x-4 ml-4">
            <Link href="/login">
            <Button variant="outline" className="justify-start bg-black hover:bg-[#c74021] text-blue-50">
               Sign In
            </Button>
          </Link>

           <Link href="/register">
          <Button variant="outline" className="w-full justify-start bg-[#faa617]">
            Sign up
          </Button>
        </Link>
        </div>}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>

                <div className="flex flex-col space-y-4 mt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input type="search" placeholder="Search food nearby..." className="pl-10" />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Link href="/food" className="block text-lg font-medium">
                      Food
                    </Link>
                    <Link href="/drinks" className="block text-lg font-medium">
                      Drinks
                    </Link>
                    <Link href="/deals" className="block text-lg font-medium text-orange-600">
                      Best Deals Today
                    </Link>
                    <Link href="/restaurants" className="block text-lg font-medium">
                      Restaurants
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
