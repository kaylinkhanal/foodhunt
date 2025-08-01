"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { TrendingUp, BarChart3, Users, ShoppingCart, Calendar } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, LabelList, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const lineChartConfig = {
  revenue: {
    label: "Revenue",
    color: "#FB5700",
  },
} satisfies ChartConfig


const chartConfig: ChartConfig = {
  count: {
    label: "Orders",
  },
  Pending: {
    label: "Pending",
    color: "#F6A719",
  },
  "In Progress": {
    label: "In Progress",
    color: "#FB5700",
  },
  Completed: {
    label: "Completed",
    color: "#10B981",
  },
  Cancelled: {
    label: "Cancelled",
    color: "#EF4444",
  },
  Booked: {
    label: "Booked",
    color: "#8B5CF6",
  },
};

const Dashboard = () => {
  const [orderData, setOrderData] = useState({ orders: [], totalDbOrders: 0 });

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
      setOrderData(response.data);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusCounts: Record<string, number> = {};
  orderData.orders.forEach((order: any) => {
    const status = order.status;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  const statuses = [
    { status: "Pending", fill: "#F6A719" },
    { status: "In Progress", fill: "#FB5700" },
    { status: "Completed", fill: "#10B981" },
    { status: "Cancelled", fill: "#EF4444" },
    { status: "Booked", fill: "#8B5CF6" },
  ];

  const chartData = statuses.map((item) => ({
    status: item.status,
    count: statusCounts[item.status] || 0,
    fill: item.fill,
  }));

  const generateMonthlyRevenue = () => {
    const monthlyTotals: { [key: string]: number } = {};

    orderData.orders.forEach((order: any) => {
      const date = new Date(order.createdAt);
      const monthName = date.toLocaleString("default", { month: "long" });
      if (!monthlyTotals[monthName]) {
        monthlyTotals[monthName] = 0;
      }
      monthlyTotals[monthName] += order.price;
    });

    const allMonths = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return allMonths.map((month) => ({
      month,
      revenue: monthlyTotals[month] || 0,
    }));
  };

  const lineChartData = generateMonthlyRevenue();

  const totalOrders = orderData.totalDbOrders;
  const totalRevenue = orderData.orders.reduce((sum: number, order: any) => sum + order.price, 0);
  const completedOrders = statusCounts["Completed"] || 0;
  const pendingOrders = statusCounts["Pending"] || 0;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFFFFF", padding: "1.5rem" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#FB5700", marginBottom: "0.5rem" }}>Admin Dashboard</h1>
        <p style={{ color: "#F6A719" }}>Monitor your business performance and analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Orders */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-8 -translate-y-8">
            <div className="w-full h-full rounded-full" style={{ backgroundColor: "#FB5700", opacity: 0.1 }}></div>
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle style={{ fontSize: "0.875rem", fontWeight: "500", color: "#FB5700" }}>Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4" style={{ color: "#FB5700" }} />
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#FB5700" }}>{totalOrders}</div>
            {/* <p style={{ fontSize: "0.75rem", color: "#F6A719", marginTop: "0.25rem" }}>
                            Total Order
                        </p> */}
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-8 -translate-y-8">
            <div className="w-full h-full rounded-full" style={{ backgroundColor: "#F6A719", opacity: 0.1 }}></div>
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle style={{ fontSize: "0.875rem", fontWeight: "500", color: "#FB5700" }}>Total Revenue</CardTitle>
            <BarChart3 className="h-4 w-4" style={{ color: "#F6A719" }} />
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#FB5700" }}>${totalRevenue.toLocaleString()}</div>
            {/* <p style={{ fontSize: "0.75rem", color: "#F6A719", marginTop: "0.25rem" }}>
                            +5.2% from last month
                        </p> */}
          </CardContent>
        </Card>

        {/* Completed Orders */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-8 -translate-y-8">
            <div className="w-full h-full rounded-full" style={{ backgroundColor: "#10B981", opacity: 0.1 }}></div>
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle style={{ fontSize: "0.875rem", fontWeight: "500", color: "#FB5700" }}>Completed Orders</CardTitle>
            <Users className="h-4 w-4" style={{ color: "#10B981" }} />
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#FB5700" }}>{completedOrders}</div>
            {/* <p style={{ fontSize: "0.75rem", color: "#F6A719", marginTop: "0.25rem" }}>
                            +12% from last month
                        </p> */}
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-8 -translate-y-8">
            <div className="w-full h-full rounded-full" style={{ backgroundColor: "#F6A719", opacity: 0.1 }}></div>
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle style={{ fontSize: "0.875rem", fontWeight: "500", color: "#FB5700" }}>Pending Orders</CardTitle>
            <Calendar className="h-4 w-4" style={{ color: "#F6A719" }} />
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#FB5700" }}>{pendingOrders}</div>
            {/* <p style={{ fontSize: "0.75rem", color: "#F6A719", marginTop: "0.25rem" }}>
                            -3% from last month
                        </p> */}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="xl:col-span-2">
          <Card className="shadow-lg border-0">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FB5700" }}></div>
                <CardTitle style={{ fontSize: "1.25rem", fontWeight: "600", color: "#FB5700" }}>Revenue Overview</CardTitle>
              </div>
              <CardDescription style={{ color: "#F6A719" }}>Monthly revenue for the current year</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ChartContainer config={lineChartConfig}>
                <LineChart data={lineChartData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F6A719" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: "#FB5700", fontSize: 12 }}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={{ stroke: "#FB5700", strokeWidth: 1, strokeDasharray: "4 4" }}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="revenue"
                    type="monotone"
                    stroke="#FB5700"
                    strokeWidth={3}
                    dot={{ fill: "#FB5700", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#FB5700", strokeWidth: 2, fill: "#FFFFFF" }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-4">
              <div className="flex gap-2 leading-none font-medium" style={{ color: "#FB5700" }}>
                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
              </div>
              <div style={{ color: "#F6A719" }}>
                Showing total revenue for the whole year
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Pie Chart */}
        <Card className="shadow-lg border-0">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#F6A719" }}></div>
              <CardTitle style={{ fontSize: "1.25rem", fontWeight: "600", color: "#FB5700" }}>Order Status</CardTitle>
            </div>
            <CardDescription style={{ color: "#F6A719" }}>Distribution of order statuses</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[280px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={60}
                  strokeWidth={2}
                  stroke="#FFFFFF"
                >
                  <LabelList dataKey="status" className="fill-white font-medium" stroke="none" fontSize={11} />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm border-t pt-4">
            <div className="flex items-center gap-2 leading-none font-medium" style={{ color: "#FB5700" }}>
              Updated in real-time <TrendingUp className="h-4 w-4" />
            </div>
            <div style={{ color: "#F6A719" }}>
              Live order status distribution
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;