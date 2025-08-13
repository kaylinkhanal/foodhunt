"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const router = useRouter();
  const [orderInsightData, setOrderInsightData] = useState([]);
  const [kycStatus, setKycStatus] = useState({
    isKycSubmitted: false,
    isKycApproved: false,
  });
  const { _id } = useSelector((state) => state.user);
  const fetchOrderInsights = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders-insights?sellerId=${_id}`
      );
      setOrderInsightData(data);
    } catch (error) {
      console.error("Failed to fetch KYC status", error);
    }
  };

  const fetchKycStatus = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/kycs/${_id}`
      );
      setKycStatus(data);
    } catch (error) {
      console.error("Failed to fetch KYC status", error);
    }
  };

  useEffect(() => {
    fetchOrderInsights()
    fetchKycStatus();
  }, []);

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          Dashboard
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full" />
      </div>

      <div className="space-y-6">
        {kycStatus.isKycSubmitted && !kycStatus.isKycApproved && (
          <Alert className="border-blue-200 bg-blue-50 shadow-md rounded-xl p-6 flex items-start gap-4">
            <Clock className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <AlertTitle className="text-blue-800 text-xl font-semibold mb-2">
                KYC Under Review
              </AlertTitle>
              <AlertDescription className="text-blue-700 text-base">
                Your documents are currently being reviewed. This process
                typically takes 24–48 hours.
              </AlertDescription>
            </div>
          </Alert>
        )}

        {!kycStatus.isKycSubmitted && !kycStatus.isKycApproved && (
          <Alert className="border-yellow-200 bg-yellow-50 shadow-md rounded-xl p-6 flex items-start gap-4">
            <AlertCircleIcon className="h-6 w-6 text-yellow-600 mt-1" />
            <div>
              <AlertTitle className="text-yellow-800 text-xl font-semibold mb-2">
                Complete Your KYC
              </AlertTitle>
              <AlertDescription className="text-yellow-700 text-base">
                <p className="mb-4">
                  To access all features, please complete your KYC verification.
                </p>
                <button
                  onClick={() => router.push("/seller/kyc")}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Fill KYC Now
                </button>
              </AlertDescription>
            </div>
          </Alert>
        )}
      </div>

{JSON.stringify(orderInsightData)}
      
    </div>
  );
};

export default Dashboard;
