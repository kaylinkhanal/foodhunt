"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

// Import Shadcn UI Chart components
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";

const Dashboard = () => {
  const router = useRouter();
  const { _id } = useSelector((state) => state.user);
  const [kycStatus, setKycStatus] = useState({
    isKycSubmitted: false,
    isKycApproved: false,
  });
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for processed chart data
  const [orderStatusChartData, setOrderStatusChartData] = useState([]);
  const [dailyRevenueChartData, setDailyRevenueChartData] = useState([]);
  const [productSalesChartData, setProductSalesChartData] = useState([]);
  const [paymentMethodChartData, setPaymentMethodChartData] = useState([]);

  // Define a palette of orange shades (Tailwind orange-500 to orange-900)
  const orangePalette = [
    "#F97316", // orange-500
    "#EA580C", // orange-600
    "#C2410C", // orange-700
    "#9A3412", // orange-800
    "#7C2D12", // orange-900
  ];

  // Function to process order data for charts
  const processChartData = (orders) => {
    // 1. Order Status Analysis (Pie Chart)
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const statusData = Object.keys(statusCounts).map((status, index) => ({
      name: status,
      value: statusCounts[status],
      fill: orangePalette[index % orangePalette.length], // Assign colors from palette
    }));
    setOrderStatusChartData(statusData);

    // 2. Total Revenue Per Day Analysis (Bar Chart)
    const dailyRevenueMap = orders.reduce((acc, order) => {
      // Ensure productId and discountedPrice are available
      if (!order.productId || typeof order.productId.discountedPrice === 'undefined' || typeof order.quantity === 'undefined') {
        console.warn("Skipping order due to missing product or quantity data:", order);
        return acc;
      }

      const dateObj = new Date(order.createdAt);
      // Use YYYY-MM-DD as a consistent key for grouping and initial sorting
      const dateKey = dateObj.toISOString().split('T')[0];
      
      // Calculate actual revenue: quantity * discountedPrice
      const revenue = order.quantity * order.productId.discountedPrice;

      if (!acc[dateKey]) {
        acc[dateKey] = {
          totalRevenue: 0,
          originalDate: dateObj // Store original date object for proper chronological sorting
        };
      }
      acc[dateKey].totalRevenue += revenue;
      return acc;
    }, {});

    // Convert map to array and sort chronologically
    const revenueData = Object.keys(dailyRevenueMap).map(dateKey => ({
      // Format date for display: "Mon Day" (e.g., "Jul 24")
      date: new Date(dateKey).toLocaleString('en-US', { month: 'short', day: 'numeric' }),
      totalRevenue: dailyRevenueMap[dateKey].totalRevenue,
      sortKey: dailyRevenueMap[dateKey].originalDate.getTime() // Use timestamp for sorting
    })).sort((a, b) => a.sortKey - b.sortKey); // Sort by timestamp
    
    setDailyRevenueChartData(revenueData);

    // 3. Product Sales Analysis (Bar Chart - Quantity Sold)
    const productSales = orders.reduce((acc, order) => {
      const productName = order.productId?.name || 'Unknown Product';
      acc[productName] = (acc[productName] || 0) + order.quantity;
      return acc;
    }, {});

    const productSalesData = Object.keys(productSales).map((name, index) => ({
      name,
      quantitySold: productSales[name],
      fill: orangePalette[index % orangePalette.length], // Assign colors from palette
    }));
    setProductSalesChartData(productSalesData);

    // 4. Payment Method Distribution (Pie Chart)
    const paymentMethodCounts = orders.reduce((acc, order) => {
      acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
      return acc;
    }, {});

    const paymentMethodData = Object.keys(paymentMethodCounts).map((method, index) => ({
      name: method,
      value: paymentMethodCounts[method],
      fill: orangePalette[index % orangePalette.length], // Assign colors from palette
    }));
    setPaymentMethodChartData(paymentMethodData);
  };

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders?sellerId=${_id}`
      );
      setOrdersData(data.orders);
      processChartData(data.orders);
    } catch (err) {
      console.error("Error fetching chart data:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

    if (_id) {
      fetchKycStatus();
      fetchChartData();
    }
  }, [_id]);

  if (loading) {
    return (
      <div className="px-6 py-8 max-w-5xl mx-auto min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-8 max-w-5xl mx-auto min-h-screen flex items-center justify-center">
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          Seller Dashboard
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full" />
      </div>

      <div className="space-y-6 mb-10">
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

      {kycStatus.isKycApproved && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Status Analysis */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Order Status Distribution</h2>
            <ChartContainer
              config={{
                value: {
                  label: "Orders",
                  color: orangePalette[0],
                },
              }}
              className="min-h-[200px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={orderStatusChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  strokeWidth={2}
                  paddingAngle={5}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                />
              </PieChart>
            </ChartContainer>
          </div>

          {/* Total Revenue Per Day Analysis (Now a Bar Chart) */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Daily Revenue Trend (NPR)</h2>
            <ChartContainer
              config={{
                totalRevenue: {
                  label: "Revenue",
                  color: orangePalette[1], // Using orange-600 for the bars
                },
              }}
              className="min-h-[200px] w-full"
            >
              <BarChart data={dailyRevenueChartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={30}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `NPR ${value}`} // Format as NPR
                  tickMargin={8}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar
                  dataKey="totalRevenue"
                  fill={orangePalette[1]} // Use orange-600 for the bars
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </div>

          {/* Product Sales by Quantity */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Product Sales (Quantity)</h2>
            <ChartContainer
              config={{
                quantitySold: {
                  label: "Quantity Sold",
                  color: orangePalette[2],
                },
              }}
              className="min-h-[200px] w-full"
            >
              <BarChart data={productSalesChartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="quantitySold" fill={orangePalette[2]} radius={4} />
              </BarChart>
            </ChartContainer>
          </div>

          {/* Payment Method Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Payment Method Distribution</h2>
            <ChartContainer
              config={{
                value: {
                  label: "Orders",
                  color: orangePalette[3],
                },
              }}
              className="min-h-[200px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={paymentMethodChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  strokeWidth={2}
                  paddingAngle={5}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                />
              </PieChart>
            </ChartContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
