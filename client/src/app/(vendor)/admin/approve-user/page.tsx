'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface KycItem {
  _id: string;
  seller: {
    name: string;
    email: string;
    phoneNumber: string;
    location: string;
  };
  status: string;
}

const UserApprovalCard = () => {
  const [kycs, setKycs] = useState<KycItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  const fetchKycs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/kycs?status=pending`);
      setKycs(data);
    } catch (error) {
      toast.error("Failed to fetch KYC data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycs();
  }, []);

  const handleApproval = async (id: string, action: "approve" | "reject") => {
    try {
      setProcessingIds((prev) => [...prev, id]);
      const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/kycs/${id}`, { status: action });
      if (data) {
        toast.success(`User ${action}d successfully`);
        fetchKycs();
      }
    } catch (error) {
      toast.error(`Failed to ${action} user`);
    } finally {
      setProcessingIds((prev) => prev.filter((item) => item !== id));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-orange-600" />
            Seller Approval Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
          ) : kycs.length > 0 ? (
            <AnimatePresence>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {kycs.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="relative overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100/30 rounded-full -mr-12 -mt-12" />
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold text-gray-800">{item.seller.name}</h2>
                          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                            Pending
                          </span>
                        </div>
                        <div className="space-y-2 mb-6">
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="font-medium">Email:</span> {item.seller.email}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="font-medium">Phone:</span> {item.seller.phoneNumber}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="font-medium">Location:</span> {item.seller.location}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleApproval(item._id, "approve")}
                            disabled={processingIds.includes(item._id)}
                            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white transition-colors duration-200"
                          >
                            {processingIds.includes(item._id) ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                            )}
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleApproval(item._id, "reject")}
                            disabled={processingIds.includes(item._id)}
                            variant="outline"
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                          >
                            {processingIds.includes(item._id) ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-2" />
                            )}
                            Reject
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No users to approve</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserApprovalCard;