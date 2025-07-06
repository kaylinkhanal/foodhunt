'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Phone, Mail, MapPin, Star, Heart, Clock } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CustomerProfile = () => {
    const [customerData, setCustomerData] = useState([])
    const { role } = useSelector((state) => state.user);
    console.log(role)
    const fetchCustomerData = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/users?role=${role}`
            );
            setCustomerData(response.data[0]);
            console.log(response.data)
        } catch (err) {
            console.error("Error fetching customers", err);
        }
    };

    useEffect(() => {
        fetchCustomerData();
    }, []);
    return (
        <div className="min-h-screen bg-orange-50">
            {/* Header Section */}
            <div className="bg-[#B7312D] text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white"></div>
                    <div className="absolute top-32 right-20 w-16 h-16 rounded-full bg-white"></div>
                    <div className="absolute bottom-10 left-1/3 w-12 h-12 rounded-full bg-white"></div>
                </div>
                <div className="relative z-10 px-6 py-12">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl font-bold mb-2">FoodHunt</h1>
                        <p className="text-xl opacity-90">Customer Profile</p>
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
                                    <Avatar className="w-32 h-32 ring-4 ring-[#FAA617] mb-4">
                                        <AvatarImage src={customerData?.avatar || "/profile.jpg"} alt={customerData.name} />

                                    </Avatar>
                                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{customerData.name}</h2>
                                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#FAA617] text-white capitalize">
                                        <User className="w-4 h-4 mr-2" />
                                        {customerData.role}
                                    </span>
                                </div>

                                {/* Info Grid */}
                                <div className="flex-1 grid md:grid-cols-2 gap-6 w-full">
                                    <div className="bg-gray-50 p-6 rounded-xl">
                                        <div className="flex items-center mb-3">
                                            <Mail className="w-5 h-5 text-[#B7312D] mr-3" />
                                            <h3 className="font-semibold text-gray-700">Email</h3>
                                        </div>
                                        <p className="text-gray-800 font-medium">{customerData.email}</p>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-xl">
                                        <div className="flex items-center mb-3">
                                            <Phone className="w-5 h-5 text-[#B7312D] mr-3" />
                                            <h3 className="font-semibold text-gray-700">Phone</h3>
                                        </div>
                                        <p className="text-gray-800 font-medium">{customerData.phoneNumber}</p>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-xl md:col-span-2">
                                        <div className="flex items-center mb-3">
                                            <MapPin className="w-5 h-5 text-[#B7312D] mr-3" />
                                            <h3 className="font-semibold text-gray-700">Location</h3>
                                        </div>
                                        <p>
                                            {customerData?.coords?.lat && customerData?.coords?.lng
                                                ? `Latitude: ${customerData.coords.lat}, Longitude: ${customerData.coords.lng}`
                                                : 'Location not set'}
                                        </p>

                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card className="bg-[#FAA617] text-white border-0">
                            <CardContent className="p-6 text-center">
                                <Heart className="w-8 h-8 mx-auto mb-3" />
                                <h3 className="text-2xl font-bold mb-1">24</h3>
                                <p className="opacity-90">Favorite Restaurants</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#B7312D] text-white border-0">
                            <CardContent className="p-6 text-center">
                                <Star className="w-8 h-8 mx-auto mb-3" />
                                <h3 className="text-2xl font-bold mb-1">4.8</h3>
                                <p className="opacity-90">Customer Rating</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-orange-600 text-white border-0">
                            <CardContent className="p-6 text-center">
                                <Clock className="w-8 h-8 mx-auto mb-3" />
                                <h3 className="text-2xl font-bold mb-1">127</h3>
                                <p className="opacity-90">Orders Placed</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card className="bg-white shadow-lg border-0">
                        <CardHeader className="bg-[#B7312D] text-white">
                            <CardTitle className="text-xl">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-[#FAA617] rounded-full mr-4"></div>
                                        <span className="text-gray-800">Ordered from Italian Bistro</span>
                                    </div>
                                    <span className="text-gray-500 text-sm">2 hours ago</span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-[#B7312D] rounded-full mr-4"></div>
                                        <span className="text-gray-800">Rated Spice Garden - 5 stars</span>
                                    </div>
                                    <span className="text-gray-500 text-sm">1 day ago</span>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-4"></div>
                                        <span className="text-gray-800">Added Burger Palace to favorites</span>
                                    </div>
                                    <span className="text-gray-500 text-sm">3 days ago</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;