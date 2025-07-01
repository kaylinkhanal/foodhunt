"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";

const AdminCategoriesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="px-6 py-10 space-y-14">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Category Management
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base">
            Organize and manage your product categories efficiently. Create new categories or modify existing ones to
            keep your catalog well-structured.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <Card className="group h-[300px] hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 p-6">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Add New Category</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-gray-600 leading-relaxed text-sm">
                Create a new product to expand your catalog organization. Set up category details,
                descriptions, and hierarchy.
              </p>
              <Link href="/admin/categories/add-category" className="block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 text-base font-medium">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Category
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group h-[300px] hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 p-6">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white border-2 border-orange-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Eye className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle className="text-xl text-gray-900">Manage Categories</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-gray-600 leading-relaxed text-sm">
                View, edit, or delete existing categories. Organize your category structure and update category
                information as needed.
              </p>
              <Link href="/admin/categories/view-category" className="block">
                <Button
                  variant="outline"
                  className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 text-base font-medium bg-transparent"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  View All Categories
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
