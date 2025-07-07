"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const user = useSelector((state: any) => state.user);

  const {email, role, phoneNumber } = user || {};

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm shadow-lg border-0 rounded-xl bg-white relative">
        <Button
          onClick={() => window.dispatchEvent(new Event("close-profile"))}
          className="absolute top-3 right-3 bg-red-500 text-white hover:bg-red-600"
          size="sm"
          aria-label="Close Profile"
        >
          <X />
        </Button>

        <CardHeader className="flex flex-col items-center justify-center py-4">
          <Avatar className="h-16 w-16 border-2 border-orange-400 shadow-md mb-3">
            <AvatarImage src="https://img.freepik.com/premium-vector/young-man-avatar-character-due-avatar-man-vector-icon-cartoon-illustration_1186924-4438.jpg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl font-semibold text-orange-600">Profile</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-3 space-y-3 text-sm">

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Role</span>
            <span className="text-gray-800 font-semibold capitalize">{role || "N/A"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Email</span>
            <span className="text-gray-800 font-semibold">{email || "N/A"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Phone Number</span>
            <span className="text-gray-800 font-semibold">{phoneNumber || "Not Provided"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
