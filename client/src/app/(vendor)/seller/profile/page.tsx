'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Store, Phone, Mail, MapPin, CreditCard, Calendar, CheckCircle, XCircle, TrendingUp, Users, Award } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const SellerProfile = () => {
  const [sellerData, setSellerData] = useState([]);
  const { role } = useSelector((state) => state.user);
  console.log(role)
  const detchSellerData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users?role=${role}`
      );
      setSellerData(response.data[0]);
    } catch (err) {
      console.error("Error fetching customers", err);
    }
  };

  useEffect(() => {
    detchSellerData();
  }, []);

  const getKycStatusColor = () => {
    if (!sellerData.isKycSubmitted) return 'bg-gray-500';
    if (sellerData.isKycApproved) return 'bg-green-500';
    return 'bg-yellow-500';
  };

  const getKycStatusText = () => {
    if (!sellerData.isKycSubmitted) return 'Not Submitted';
    if (sellerData.isKycApproved) return 'Approved';
    return 'Pending Review';
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header Section */}
      <div className="bg-[#FAA617] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-white"></div>
          <div className="absolute top-40 left-16 w-18 h-18 rounded-full bg-white"></div>
          <div className="absolute bottom-10 right-1/4 w-14 h-14 rounded-full bg-white"></div>
        </div>
        <div className="relative z-10 px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-2">FoodHunt</h1>
            <p className="text-xl opacity-90">Seller Dashboard</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 -mt-8 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <Card className="bg-white shadow-2xl border-0 mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center">
                  <Avatar className="w-32 h-32 ring-4 ring-[#B7312D] mb-4">
                    <AvatarImage src={sellerData.avatar || "/profile.jpg"} alt={sellerData.name} />
                  </Avatar>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{sellerData.name}</h2>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#B7312D] text-white capitalize">
                      <Store className="w-4 h-4 mr-2" />
                      {sellerData.role}
                    </span>
                    <Badge className={`${getKycStatusColor()} text-white flex items-center gap-1`}>
                      {sellerData.isKycApproved ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      KYC: {getKycStatusText()}
                    </Badge>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="flex-1 grid md:grid-cols-2 gap-6 w-full">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center mb-3">
                      <Mail className="w-5 h-5 text-[#B7312D] mr-3" />
                      <h3 className="font-semibold text-gray-700">Email</h3>
                    </div>
                    <p className="text-gray-800 font-medium">{sellerData.email}</p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center mb-3">
                      <Phone className="w-5 h-5 text-[#B7312D] mr-3" />
                      <h3 className="font-semibold text-gray-700">Phone</h3>
                    </div>
                    <p className="text-gray-800 font-medium">{sellerData.phoneNumber}</p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center mb-3">
                      <MapPin className="w-5 h-5 text-[#B7312D] mr-3" />
                      <h3 className="font-semibold text-gray-700">Location</h3>
                    </div>
                    <p className="text-gray-800 font-medium">{sellerData.location}</p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center mb-3">
                      <CreditCard className="w-5 h-5 text-[#B7312D] mr-3" />
                      <h3 className="font-semibold text-gray-700">PAN ID</h3>
                    </div>
                    <p className="text-gray-800 font-medium font-mono">{sellerData.panId}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-[#B7312D] text-white border-0">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-3" />
                <h3 className="text-2xl font-bold mb-1">₹45,200</h3>
                <p className="opacity-90">Monthly Revenue</p>
              </CardContent>
            </Card>

            <Card className="bg-[#FAA617] text-white border-0">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-3" />
                <h3 className="text-2xl font-bold mb-1">1,847</h3>
                <p className="opacity-90">Total Customers</p>
              </CardContent>
            </Card>

            <Card className="bg-green-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 mx-auto mb-3" />
                <h3 className="text-2xl font-bold mb-1">4.9</h3>
                <p className="opacity-90">Restaurant Rating</p>
              </CardContent>
            </Card>
          </div>

          {/* KYC Information */}
          <Card className="bg-white shadow-lg border-0 mb-8">
            <CardHeader className="bg-[#FAA617] text-white">
              <CardTitle className="text-xl">KYC Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Calendar className="w-4 h-4 text-[#B7312D] mr-2" />
                      <span className="font-semibold text-gray-700">Registration Date</span>
                    </div>
                    <p className="text-gray-800 ml-6">
                      {new Date(sellerData.registrationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <MapPin className="w-4 h-4 text-[#B7312D] mr-2" />
                      <span className="font-semibold text-gray-700">Coordinates</span>
                    </div>
                    <p className="text-gray-800 ml-6">
                      {sellerData?.coords?.lat && sellerData?.coords?.lng
                        ? `${sellerData.coords.lat}, ${sellerData.coords.lng}`
                        : 'Not available'
                      }
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">Verification Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Documents Submitted</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Identity Verified</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Business Registration</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-[#B7312D] text-white">
              <CardTitle className="text-xl">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                    <div>
                      <span className="text-gray-800 font-medium">Order #FH001234</span>
                      <p className="text-sm text-gray-500">2x Butter Chicken, 1x Naan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[#B7312D] font-semibold">₹450</span>
                    <p className="text-sm text-gray-500">15 min ago</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#FAA617] rounded-full mr-4"></div>
                    <div>
                      <span className="text-gray-800 font-medium">Order #FH001235</span>
                      <p className="text-sm text-gray-500">1x Biryani, 1x Raita</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[#B7312D] font-semibold">₹320</span>
                    <p className="text-sm text-gray-500">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-4"></div>
                    <div>
                      <span className="text-gray-800 font-medium">Order #FH001236</span>
                      <p className="text-sm text-gray-500">3x Masala Dosa, 1x Coffee</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[#B7312D] font-semibold">₹280</span>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;