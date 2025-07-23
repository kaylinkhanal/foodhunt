"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  itemCount: number;
  status: "active" | "inactive";
  emoji: string;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    emoji: "",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchCategories = async () => {
    const { data } = await axios.get("http://localhost:8080/categories");
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    await axios.post(process.env.NEXT_PUBLIC_API_URL + "/categories", {
      name: formData.name,
      description: formData.description,
      emoji: formData.emoji,
    });
    fetchCategories();
    setShowEmojiPicker(false);
    setFormData({ name: "", description: "", emoji: "" });
    setIsCreateDialogOpen(false);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      emoji: category.emoji,
    });
  };

  const handleUpdateCategory = () => {
    if (editingCategory && formData.name && formData.description) {
      setCategories(
        categories.map((cat) =>
          cat._id === editingCategory._id
            ? {
                ...cat,
                name: formData.name,
                description: formData.description,
                emoji: formData.emoji,
              }
            : cat
        )
      );
      setEditingCategory(null);
      setShowEmojiPicker(false);
      setFormData({ name: "", description: "", emoji: "" });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const { data } = await axios.delete(
      "http://localhost:8080/categories/" + id
    );
    if (data) fetchCategories();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Food Categories
          </h1>
          <p className="text-gray-600">
            Manage your food categories and organize your menu items
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-orange-200 focus:border-orange-400"
            />
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={(open) => {
              setIsCreateDialogOpen(open);
              if (!open) {
                setShowEmojiPicker(false);
                setFormData({ name: "", description: "", emoji: "" });
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-orange-700">
                  Create New Category
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter category name"
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter category description"
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="emoji">Emoji</Label>
                  <div className="relative">
                    <Input
                      id="emoji"
                      value={formData.emoji}
                      readOnly
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      placeholder="Click to select an emoji"
                      className="border-orange-200 focus:border-orange-400 cursor-pointer"
                    />
                    {showEmojiPicker && (
                      <div className="absolute -top-60 z-10 mt-1">
                        <EmojiPicker
                          onEmojiClick={(emojiData) => {
                            setFormData({
                              ...formData,
                              emoji: emojiData.emoji,
                            });
                            setShowEmojiPicker(false);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEmojiPicker(false);
                    setFormData({ name: "", description: "", emoji: "" });
                    setIsCreateDialogOpen(false);
                  }}
                  className="border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateCategory}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Create Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Categories</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {categories.length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-orange-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Categories</p>
                  <p className="text-2xl font-bold text-green-600">
                    {categories.filter((cat) => cat.status === "active").length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {categories.reduce((sum, cat) => sum + cat.itemCount, 0)}
                  </p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inactive Categories</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {
                      categories.filter((cat) => cat.status === "inactive")
                        .length
                    }
                  </p>
                </div>
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-gray-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card
              key={category._id}
              className="border-orange-200 hover:shadow-lg transition-shadow"
            >
              <CardHeader className="p-4 pb-2">
                <div className="w-full h-32 bg-gradient-to-br from-orange-300 to-orange-400 rounded-lg flex items-center justify-center mb-2">
                  <p className="text-center text-5xl">{category.emoji}</p>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg text-gray-900">
                    {category.name}
                  </CardTitle>
                  <Badge
                    variant={
                      category.status === "active" ? "default" : "secondary"
                    }
                    className={
                      category.status === "active"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {category.status}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {category.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{category.itemCount} items</span>
                  <span>Created: {category.createdAt}</span>
                </div>
                <div className="flex gap-2">
                  <Dialog
                    open={editingCategory?._id === category._id}
                    onOpenChange={(open) => {
                      if (!open) {
                        setEditingCategory(null);
                        setShowEmojiPicker(false);
                        setFormData({ name: "", description: "", emoji: "" });
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                        className="flex-1 border-orange-200 text-orange-700 hover:bg-orange-50"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle className="text-orange-700">
                          Edit Category
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-name">Category Name</Label>
                          <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="border-orange-200 focus:border-orange-400"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-description">Description</Label>
                          <Textarea
                            id="edit-description"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            className="border-orange-200 focus:border-orange-400"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-emoji">Emoji</Label>
                          <div className="relative">
                            <Input
                              id="edit-emoji"
                              value={formData.emoji}
                              readOnly
                              onClick={() =>
                                setShowEmojiPicker(!showEmojiPicker)
                              }
                              placeholder="Click to select an emoji"
                              className="border-orange-200 focus:border-orange-400 cursor-pointer"
                            />
                            {showEmojiPicker && (
                              <div className="absolute -top-60 z-10 mt-1">
                                <EmojiPicker
                                  onEmojiClick={(emojiData) => {
                                    setFormData({
                                      ...formData,
                                      emoji: emojiData.emoji,
                                    });
                                    setShowEmojiPicker(false);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingCategory(null);
                            setShowEmojiPicker(false);
                            setFormData({
                              name: "",
                              description: "",
                              emoji: "",
                            });
                          }}
                          className="border-orange-200 text-orange-700 hover:bg-orange-50"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleUpdateCategory}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          Update Category
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the category "{category.name}" and all
                          associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-orange-200 text-orange-700 hover:bg-orange-50">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCategory(category._id)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by creating your first category"}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Category
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
