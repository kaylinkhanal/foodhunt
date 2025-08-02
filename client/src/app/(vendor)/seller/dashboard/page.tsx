
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Clock, RefreshCw, Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [darkMode, setDarkMode] = useState(false);
  const [orderStatusChartData, setOrderStatusChartData] = useState([]);
  const [dailyRevenueChartData, setDailyRevenueChartData] = useState([]);
  const [productSalesChartData, setProductSalesChartData] = useState([]);
  const [paymentMethodChartData, setPaymentMethodChartData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const orangePalette = [
    "#F97316",
    "#EA580C",
    "#C2410C",
    "#9A3412",
    "#7C2D12",
  ];

  //1.ensures orders is an array, 2. filters orders by date range, 3.stores filter data on processedOrders for generating charts data
  const processChartData = (orders) => {
    const filteredOrders = Array.isArray(orders) ? orders : [];
    let processedOrders = filteredOrders;

    if (startDate && endDate) {

      processedOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        return orderDate >= startOfDay && orderDate <= endOfDay;
      });
    }

    //counts the same status order
    const statusCounts = processedOrders.reduce((acc, order) => {
      if (order.status) acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});



 //creates objects with name status and counts
    const statusData = Object.keys(statusCounts).map((status, index) => ({
      name: status,
      value: statusCounts[status],
      fill: orangePalette[index % orangePalette.length],
    }));
    setOrderStatusChartData(statusData);




    //for dalily reveneu chart
    const dailyRevenueMap = processedOrders.reduce((acc, order) => {
      if (
        order.productId &&
        typeof order.productId.discountedPrice !== 'undefined' &&
        typeof order.quantity !== 'undefined'
      ) {
        const dateObj = new Date(order.createdAt);
        const dateKey = dateObj.toISOString().split('T')[0];
        const revenue = order.quantity * order.productId.discountedPrice;

        if (!acc[dateKey]) {
          acc[dateKey] = { totalRevenue: 0, originalDate: dateObj };
        }
        acc[dateKey].totalRevenue += revenue;
      }
      return acc;
    }, {});


    const revenueData = Object.keys(dailyRevenueMap)
      .map(dateKey => ({
        date: new Date(dateKey).toLocaleString('en-US', { month: 'short', day: 'numeric' }), //like aug1,jan12 ect
        totalRevenue: dailyRevenueMap[dateKey].totalRevenue,
        sortKey: dailyRevenueMap[dateKey].originalDate.getTime(), //(earliest to latest).
      }))
      .sort((a, b) => a.sortKey - b.sortKey);
    setDailyRevenueChartData(revenueData);



    //for product sale chart
    const productSales = processedOrders.reduce((acc, order) => {
      const productName = order.productId?.name || 'Unknown Product';
      if (order.quantity) {
        acc[productName] = (acc[productName] || 0) + order.quantity;
      }
      return acc;
    }, {});
    const productSalesData = Object.keys(productSales).map((name, index) => ({
      name,
      quantitySold: productSales[name],
      fill: orangePalette[index % orangePalette.length],
    }));
    setProductSalesChartData(productSalesData);



    // for payment methods chart
    const paymentMethodCounts = processedOrders.reduce((acc, order) => {
      if (order.paymentMethod) {
        acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
      }
      return acc;
    }, {});
    const paymentMethodData = Object.keys(paymentMethodCounts).map((method, index) => ({
      name: method,
      value: paymentMethodCounts[method],
      fill: orangePalette[index % orangePalette.length],
    }));
    setPaymentMethodChartData(paymentMethodData);
  };





  const fetchChartData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders?sellerId=${_id}`
      );
      const orders = Array.isArray(data.orders) ? data.orders : [];
      setOrdersData(orders);
      processChartData(orders);
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

  useEffect(() => {
    if (Array.isArray(ordersData)) {
      processChartData(ordersData);
    }
  }, [startDate, endDate, ordersData]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const totalOrders = ordersData.length;
  const totalRevenue = dailyRevenueChartData.reduce((sum, data) => sum + data.totalRevenue, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <Skeleton className="h-12 w-64 mb-6 mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-[30px]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-[200px] w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md rounded-xl shadow-lg border-red-200 bg-red-50 dark:bg-red-900/50">
          <AlertCircleIcon className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-800 dark:text-red-200 font-semibold">Error</AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Seller Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchChartData}
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* KYC Alerts */}
        <div className="mb-8">
          {kycStatus.isKycSubmitted && !kycStatus.isKycApproved && (
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/50 rounded-xl shadow-lg p-6 mb-4 animate-fade-in">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <AlertTitle className="text-blue-800 dark:text-blue-200 font-semibold text-lg">
                KYC Under Review
              </AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                Your documents are being reviewed. This typically takes 24–48 hours.
              </AlertDescription>
            </Alert>
          )}

          {!kycStatus.isKycSubmitted && !kycStatus.isKycApproved && (
            <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/50 rounded-xl shadow-lg p-6 mb-4 animate-fade-in">
              <AlertCircleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              <AlertTitle className="text-yellow-800 dark:text-yellow-200 font-semibold text-lg">
                Complete Your KYC
              </AlertTitle>
              <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                <p className="mb-4">
                  To access all features, please complete your KYC verification.
                </p>
                <Button
                  onClick={() => router.push("/seller/kyc")}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Fill KYC Now
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {kycStatus.isKycApproved && (
          <>
            {/* Summary Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Total Orders</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalOrders}</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Total Revenue</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">NPR {totalRevenue.toFixed(2)}</p>
              </div>
            </div>

            {/* Date Range Pickers */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[220px] justify-start text-left font-medium text-base bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                      !startDate && "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5 text-gray-600 dark:text-gray-300" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[220px] justify-start text-left font-medium text-base bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                      !endDate && "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5 text-gray-600 dark:text-gray-300" />
                    {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-[30px]">
              {/* Order Status Analysis */}
              {Array.isArray(orderStatusChartData) && orderStatusChartData.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] animate-fade-in">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Order Status</h2>
                  <ChartContainer
                    config={{
                      value: { label: "Orders", color: orangePalette[0] },
                    }}
                    className="h-[200px] w-full"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            className="bg-gray-800 text-white dark:bg-white dark:text-gray-900 rounded-lg shadow-md p-3"
                          />
                        }
                      />
                      <Pie
                        data={orderStatusChartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={0}
                        outerRadius={80}
                        strokeWidth={2}
                        paddingAngle={5}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                        label={{ fontSize: 14, fill: darkMode ? '#fff' : '#111' }}
                      />
                    </PieChart>
                  </ChartContainer>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center animate-fade-in">
                  <p className="text-gray-500 dark:text-gray-400">No order status data available</p>
                </div>
              )}

              {/* Total Revenue Per Day */}
              {Array.isArray(dailyRevenueChartData) && dailyRevenueChartData.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] animate-fade-in">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Daily Revenue (NPR)</h2>
                  <ChartContainer
                    config={{
                      totalRevenue: { label: "Revenue", color: orangePalette[1] },
                    }}
                    className="h-[200px] w-full"
                  >
                    <LineChart data={dailyRevenueChartData} margin={{ left: 12, right: 12, top: 10, bottom: 10 }}>
                      <CartesianGrid vertical={false} stroke={darkMode ? '#444' : '#ddd'} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={20}
                        fontSize={14}
                        stroke={darkMode ? '#fff' : '#333'}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `NPR ${value}`}
                        tickMargin={8}
                        fontSize={14}
                        stroke={darkMode ? '#fff' : '#333'}
                      />
                      <ChartTooltip
                        cursor={{ stroke: orangePalette[1], strokeWidth: 1 }}
                        content={<ChartTooltipContent className="bg-gray-800 text-white dark:bg-white dark:text-gray-900 rounded-lg shadow-md p-3" />}
                      />
                      <Line
                        dataKey="totalRevenue"
                        type="monotone"
                        stroke={orangePalette[1]}
                        strokeWidth={2}
                        dot={{ r: 4, fill: orangePalette[1] }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center animate-fade-in">
                  <p className="text-gray-500 dark:text-gray-400">No revenue data available</p>
                </div>
              )}

              {/* Product Sales by Quantity */}
              {Array.isArray(productSalesChartData) && productSalesChartData.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] animate-fade-in">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Product Sales</h2>
                  <ChartContainer
                    config={{
                      quantitySold: { label: "Quantity Sold", color: orangePalette[2] },
                    }}
                    className="h-[250px] w-full"
                  >
                    <BarChart data={productSalesChartData} margin={{ left: 12, right: 12, top: 10, bottom: 40 }}>
                      <CartesianGrid vertical={false} stroke={darkMode ? '#444' : '#ddd'} />
                      <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        fontSize={14}
                        height={60}
                        stroke={darkMode ? '#fff' : '#333'}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={14}
                        stroke={darkMode ? '#fff' : '#333'}
                      />
                      <ChartTooltip
                        cursor={{ fill: orangePalette[2], opacity: 0.1 }}
                        content={<ChartTooltipContent className="bg-gray-800 text-white dark:bg-white dark:text-gray-900 rounded-lg shadow-md p-3" />}
                      />
                      <Bar dataKey="quantitySold" fill={orangePalette[2]} radius={6} maxBarSize={30} />
                    </BarChart>
                  </ChartContainer>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center animate-fade-in">
                  <p className="text-gray-500 dark:text-gray-400">No product sales data available</p>
                </div>
              )}

              {/* Payment Method Distribution */}
              {Array.isArray(paymentMethodChartData) && paymentMethodChartData.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] animate-fade-in">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Payment Methods</h2>
                  <ChartContainer
                    config={{
                      value: { label: "Orders", color: orangePalette[3] },
                    }}
                    className="h-[200px] w-full"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent className="bg-gray-800 text-white dark:bg-white dark:text-gray-900 rounded-lg shadow-md p-3" />}
                      />
                      <Pie
                        data={paymentMethodChartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={40}
                        outerRadius={80}
                        strokeWidth={2}
                        paddingAngle={5}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                        label={{ fontSize: 14, fill: darkMode ? '#fff' : '#111' }}
                      />
                    </PieChart>
                  </ChartContainer>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center animate-fade-in">
                  <p className="text-gray-500 dark:text-gray-400">No payment method data available</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
