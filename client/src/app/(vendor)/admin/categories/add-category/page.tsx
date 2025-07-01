"use client"

import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const categoryValidationSchema = Yup.object({
  name: Yup.string()
    .required("Category name is required")
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be less than 50 characters"),
  description: Yup.string()
    .required("Description is required")
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be less than 200 characters"),
  emoji: Yup.string().required("Emoji is required").max(10, "Emoji must be less than 10 characters"),
  image: Yup.mixed()
    .required("Category image is required")
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value) return false
      return value instanceof File && value.type.startsWith("image/")
    }),
})

const initialValues = {
  name: "",
  description: "",
  emoji: "🍽️",
  image: null,
}

const AddCategoriesPage = () => {
  const router = useRouter()
  const handleSubmit = async (values: typeof initialValues, { resetForm, setSubmitting }: any) => {
    try {
      setSubmitting(true)
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("description", values.description)
      formData.append("emoji", values.emoji)
      if (values.image) {
        formData.append("categoryImage", values.image)
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/category`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Category added successfully!")
      resetForm()
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong while adding the category."
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Add New Category</h1>
        <p className="text-muted-foreground mt-2">Create a new category for organizing your content</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Category Details
          </CardTitle>
          <CardDescription>Fill in the information below to create a new category</CardDescription>
        </CardHeader>
        <CardContent>
          <Formik initialValues={initialValues} validationSchema={categoryValidationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting, setFieldValue, errors, touched }) => (
              <Form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Category Name <span className="text-red-500">*</span>
                  </Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    placeholder="Enter category name"
                    className={errors.name && touched.name ? "border-red-500" : ""}
                  />
                  <ErrorMessage name="name" component="p" className="text-sm text-red-500" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Field
                    as={Textarea}
                    id="description"
                    name="description"
                    placeholder="Enter category description"
                    rows={3}
                    className={errors.description && touched.description ? "border-red-500" : ""}
                  />
                  <ErrorMessage name="description" component="p" className="text-sm text-red-500" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emoji">
                    Emoji <span className="text-red-500">*</span>
                  </Label>
                  <Field
                    as={Input}
                    id="emoji"
                    name="emoji"
                    placeholder="🍽️"
                    className={`max-w-20 text-center text-lg ${errors.emoji && touched.emoji ? "border-red-500" : ""}`}
                  />
                  <ErrorMessage name="emoji" component="p" className="text-sm text-red-500" />
                  <p className="text-xs text-muted-foreground">Choose an emoji to represent this category</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">
                    Upload Image <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="categoryImage"
                    name="categoryImage"
                    type="file"
                    accept="image/*"
                    onChange={(event) => setFieldValue("image", event.currentTarget.files?.[0] || null)}
                    className={errors.image && touched.image ? "border-red-500" : ""}
                  />
                  <ErrorMessage name="image" component="p" className="text-sm text-red-500" />
                  <p className="text-xs text-muted-foreground">Upload an image for this category</p>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1 bg-orange-600">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding Category...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddCategoriesPage
