"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

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

// Color configuration for each status
const statuses = [
  { status: "Pending", fill: "#FFA500" },      // Orange
  { status: "In Progress", fill: "#00BFFF" },  // DeepSkyBlue
  { status: "Completed", fill: "#32CD32" },    // LimeGreen
  { status: "Cancelled", fill: "#DC143C" },    // Crimson
  { status: "Booked", fill: "#8A2BE2" },       // BlueViolet
];

const chartConfig: ChartConfig = {
  count: {
    label: "Orders",
  },
  Pending: {
    label: "Pending",
    color: "#FFA500",
  },
  "In Progress": {
    label: "In Progress",
    color: "#00BFFF",
  },
  Completed: {
    label: "Completed",
    color: "#32CD32",
  },
  Cancelled: {
    label: "Cancelled",
    color: "#DC143C",
  },
  Booked: {
    label: "Booked",
    color: "#8A2BE2",
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

  // Count each status from orderData
  const statusCounts: Record<string, number> = {};
  orderData.orders.forEach((order: any) => {
    const status = order.status;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  // Build chartData
  const chartData = statuses.map((item) => ({
    status: item.status,
    count: statusCounts[item.status] || 0,
    fill: item.fill,
  }));
  console.log(chartData)
  console.log(statusCounts)
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Order Status Overview</CardTitle>
        <CardDescription>Last 6 months summary</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
            <Pie data={chartData} dataKey="count" nameKey="status">
              <LabelList
                dataKey="status"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total orders by status
        </div>
      </CardFooter>
    </Card>
  );
};

export default Dashboard;
