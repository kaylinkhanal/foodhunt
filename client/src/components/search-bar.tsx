"use client"

import * as React from "react"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 w-full max-w-2xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search food nearby..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 text-base border-gray-200"
        />
      </div>

      <Button variant="outline" size="icon" className="h-12 w-12 border-gray-200">
        <Filter className="h-4 w-4" />
        <span className="sr-only">Filter</span>
      </Button>

      <Button type="submit" className="h-12 px-6 bg-[#f59e0b] hover:bg-[#d97706]

 text-white">
        <Search className="h-4 w-4 mr-0" />
        Search
      </Button>
    </form>
  )
}
