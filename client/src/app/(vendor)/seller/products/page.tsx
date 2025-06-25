'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { setProducts, addProduct } from '@/redux/reducerSlices/productSlice';

const productSchema = Yup.object().shape({
  name: Yup.string().min(3).max(100).required('Name is required'),
  description: Yup.string().min(10).max(500).required('Description is required'),
  category: Yup.string().required('Category is required'),
  imageUrl: Yup.string().url('Invalid URL').required('Image URL is required'),
  sellerId: Yup.string().required('Seller ID is required'),
  sellerName: Yup.string().required('Seller name is required'),
  sellerEmail: Yup.string().email('Invalid email').required('Seller email is required'),
  originalPrice: Yup.number().min(0).required('Original price is required'),
  discountedPrice: Yup.number()
    .min(0)
    .required('Discounted price is required')
    .test('is-less-than-original', 'Must be ≤ original price', function (value) {
      return value <= this.parent.originalPrice;
    }),
  discountPercentage: Yup.number().min(0).max(100),
  expiryDate: Yup.date()
    .min(new Date(), 'Expiry date must be in the future')
    .required('Expiry date is required'),
  availableQuantity: Yup.number().min(1).required('Quantity is required'),
  isAvailable: Yup.boolean(),
  status: Yup.string().oneOf(['active', 'sold-out', 'expired', 'draft', 'unavailable']),
});

const categories = [
  'Snacks',
  'Veg Items',
  'Non-Veg Items',
  'Drinks',
  'Desserts',
  'Bakery',
  'Frozen Foods',
  'Other',
];

const statuses = ['active', 'Sold-Out', 'Expired', 'Draft', 'Unavailable'];

const Products = () => {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.user);
  const { email, _id, name, phoneNumber, isLoggedIn, role } = user;
  const products = useSelector((state) => state.product.products);

  const dispatch = useDispatch();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`${API_BASE_URL}/get-all-products`);
        dispatch(setProducts(data));
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(err.response?.data?.error || err.message);
        toast.error(err.response?.data?.error || 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [dispatch, API_BASE_URL]);

  const initialValues = {
    name: '',
    description: '',
    category: 'Other',
    imageUrl: '',
    sellerId: _id || '',
    sellerName: name || '',
    sellerEmail: email || '',
    originalPrice: 0,
    discountedPrice: '',
    discountPercentage: '',
    expiryDate: '',
    availableQuantity: 1,
    isAvailable: true,
    status: 'draft',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!values.discountPercentage && values.originalPrice > 0) {
        values.discountPercentage = ((values.originalPrice - values.discountedPrice) / values.originalPrice) * 100;
      }

      const { data } = await axios.post(`${API_BASE_URL}/add-product`, values);
      dispatch(addProduct(data));
      toast.success('Product added successfully!');
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error('Error adding product:', err);
      const errorMessage = err.response?.data?.error || 'Failed to add product';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-yellow-100 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-red-600">Add Product</h1>
          <p className="text-gray-600 mt-2">Showcase your food items with a vibrant and inviting form.</p>
        </motion.div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-600 text-center px-4 py-3 rounded-lg mb-4">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            <span className="ml-3 text-gray-700">Loading products...</span>
          </div>
        )}

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex justify-center mb-6"
        >
          {isLoggedIn && role === 'seller' ? (
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300"
              disabled={isLoading}
            >
              {showForm ? 'Close Form' : 'Add New Food Product'}
            </Button>
          ) : (
            <p className="text-center text-lg text-red-500 font-medium">
              Only sellers can add products. Please log in as a seller.
            </p>
          )}
        </motion.div>

        <AnimatePresence>
          {showForm && isLoggedIn && role === 'seller' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-xl border border-yellow-500 mb-12"
            >
              <Formik
                initialValues={initialValues}
                validationSchema={productSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
              >
                {({ isSubmitting, setFieldValue, values }) => (
                  <Form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Product Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name
                        </label>
                        <Field
                          type="text"
                          name="name"
                          className="w-full p-3 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                          placeholder="Enter food product name"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <Field
                          as="select"
                          name="category"
                          className="w-full p-3 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="category"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Image URL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL
                        </label>
                        <Field
                          type="url"
                          name="imageUrl"
                          className="w-full p-3 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                          placeholder="https://example.com/food-image.jpg"
                        />
                        <ErrorMessage
                          name="imageUrl"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Seller ID */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Seller ID
                        </label>
                        <Field
                          type="text"
                          name="sellerId"
                          className="w-full p-3 border border-yellow-500 rounded-lg bg-gray-100 cursor-not-allowed"
                          readOnly
                        />
                        <ErrorMessage
                          name="sellerId"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Seller Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Seller Name
                        </label>
                        <Field
                          type="text"
                          name="sellerName"
                          className="w-full p-3 border border-yellow-500 rounded-lg bg-gray-100 cursor-not-allowed"
                          readOnly
                        />
                        <ErrorMessage
                          name="sellerName"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Seller Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Seller Email
                        </label>
                        <Field
                          type="email"
                          name="sellerEmail"
                          className="w-full p-3 border border-yellow-500 rounded-lg bg-gray-100 cursor-not-allowed"
                          readOnly
                        />
                        <ErrorMessage
                          name="sellerEmail"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Original Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Original Price
                        </label>
                        <Field
                          type="number"
                          name="originalPrice"
                          className="w-full p-3 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                          placeholder="Enter original price"
                        />
                        <ErrorMessage
                          name="originalPrice"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Discounted Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Discounted Price
                        </label>
                        <Field
                          type="number"
                          name="discountedPrice"
                          className="w-full p-3 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                          placeholder="Enter discounted price"
                          onChange={(e) => {
                            setFieldValue('discountedPrice', e.target.value);
                            const original = values.originalPrice;
                            const discounted = parseFloat(e.target.value);
                            if (original > 0 && discounted <= original) {
                              setFieldValue('discountPercentage', ((original - discounted) / original) * 100);
                            } else {
                              setFieldValue('discountPercentage', 0);
                            }
                          }}
                        />
                        <ErrorMessage
                          name="discountedPrice"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Discount Percentage */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Discount Percentage
                        </label>
                        <Field
                          type="number"
                          name="discountPercentage"
                          className="w-full p-3 border border-yellow-500 rounded-lg bg-gray-100 cursor-not-allowed"
                          placeholder="Calculated automatically"
                          readOnly
                          value={values.discountPercentage ? values.discountPercentage.toFixed(2) : ''}
                        />
                        <ErrorMessage
                          name="discountPercentage"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Expiry Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <Field
                          type="date"
                          name="expiryDate"
                          className="w-full p-3 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                        />
                        <ErrorMessage
                          name="expiryDate"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Available Quantity */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Available Quantity
                        </label>
                        <Field
                          type="number"
                          name="availableQuantity"
                          className="w-full p-3 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                          placeholder="Enter quantity"
                        />
                        <ErrorMessage
                          name="availableQuantity"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Status */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <Field
                          as="select"
                          name="status"
                          className="w-full p-3 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status.toLowerCase()}>
                              {status}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="status"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <Field
                        as="textarea"
                        name="description"
                        className="w-full p-3 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all h-32 resize-none"
                        placeholder="Describe your food product"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Is Available */}
                    <div className="flex items-center">
                      <Field
                        type="checkbox"
                        name="isAvailable"
                        className="h-5 w-5 text-yellow-500 focus:ring-yellow-500 border-red-500 rounded"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-700">
                        Is Available
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300"
                      >
                        {isSubmitting || isLoading ? 'Submitting...' : 'Submit Food Product'}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Display fetched products */}
        <div className="mt-12 p-8 bg-yellow-500 rounded-2xl shadow-2xl border border-yellow-500">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Available Food Products</h2>
          {products.length === 0 && !isLoading && !error ? (
            <p className="text-center text-lg text-gray-600">No products available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-yellow-200"
                >
                  <div className="relative">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                      onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x300/e0e0e0/ffffff?text=No+Image')}
                    />
                    {product.discountPercentage > 0 && (
                      <span className="absolute top-4 right-4 bg-white text-red-500 text-xs font-bold px-3 py-1 rounded-full">
                        {product.discountPercentage.toFixed(0)}% OFF
                      </span>
                    )}
                    <span className="absolute bottom-4 left-4 bg-white text-red-500 text-xs font-semibold px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-yellow-600">${product.discountedPrice.toFixed(2)}</span>
                        {product.discountPercentage > 0 && (
                          <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Expires:</span> {new Date(product.expiryDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Quantity:</span> {product.availableQuantity}
                      </p>
                    </div>
                    {/* Seller Details */}
                    <div className="border-t border-yellow-200 pt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Seller Information</h4>
                      <p className="text-sm text-gray-600 flex items-center">
                        <svg className="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a4 4 0 100 8 4 4 0 000-8zm0 10c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
                        </svg>
                        {name || 'Unknown Seller'}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <svg className="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 2v8h12V6H4zm2 2h8v4H6V8z" />
                        </svg>
                        {email || 'No email provided'}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <svg className="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        {phoneNumber || 'No phone number provided'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;