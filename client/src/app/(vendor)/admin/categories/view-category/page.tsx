"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { AlertCircle, Package, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

const ViewCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category`)
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      setError("Failed to load categories. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    
  }

 const handleDelete = async (categoryId) => {
    if (!confirm("Are you sure you want to delete this category ?")) return
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/category/${categoryId}`)
      toast.success("Category deleted successfully")
      fetchCategories()
    } catch (error) {
      toast.error("Failed to delete job")
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-25">
        <div className="container mx-auto px-6 py-12">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div>
                <Skeleton className="h-10 w-80 mb-3" />
                <Skeleton className="h-5 w-64" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden border-orange-100 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-3 pt-4">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 flex-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-25">
        <div className="container mx-auto px-6 py-12">
          <Alert variant="destructive" className="border-red-200 bg-red-50 shadow-lg max-w-2xl mx-auto">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-base">{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-25">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-16">
          <div className="flex items-center gap-5 mb-8">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
              <Package className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-2">
                Categories
              </h1>
              <p className="text-xl text-gray-600">
                Manage your {categories.length} product categories with ease
              </p>
            </div>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-24">
            <div className="p-8 bg-gradient-to-br from-orange-100 to-orange-50 rounded-3xl w-32 h-32 mx-auto mb-8 flex items-center justify-center shadow-lg">
              <Package className="h-16 w-16 text-orange-600" />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-gray-900">No categories found</h3>
            <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
              Your category collection is empty. Categories help organize your products and make them easier to find.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card
                key={category._id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-orange-100 hover:border-orange-200 bg-white/80 backdrop-blur-sm group hover:-translate-y-1"
              >
                <CardHeader className="bg-gradient-to-r from-orange-50/50 to-white/50 pb-4">
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="secondary"
                      className="text-3xl px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-800 border-orange-200 shadow-sm"
                    >
                      {category.emoji}
                    </Badge>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">
                      {category.name}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 px-6">
                  {category.image && (
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 ring-1 ring-orange-100 shadow-sm">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${category.image}`}
                        alt={`${category.name} category`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}

                  {category.description && (
                    <CardDescription className="text-base leading-relaxed text-gray-700 line-clamp-3 font-medium">
                      {category.description}
                    </CardDescription>
                  )}

                  <div className="flex gap-3 pt-6 border-t border-orange-100">
                    <Button
                      onClick={() => handleEdit(category._id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 hover:shadow-md transition-all duration-200 font-medium"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(category._id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 hover:shadow-md transition-all duration-200 font-medium"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewCategories