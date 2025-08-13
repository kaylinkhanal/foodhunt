"use client";

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 447a190aabf8db9367714cb8458c1572ade9f77f
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bell,
  ChefHat,
  Clock,
  DollarSign,
  Eye,
  MoreHorizontal,
  Search,
  User,
} from "lucide-react";
import axios from "axios";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { socket } from "@/lib/socket";

type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Ready"
  | "Delivered"
  | "Cancelled";

interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  discountedPrice: number;
}

interface Order {
  _id: string;
  bookedById: { email: string };
  items: OrderItem[];
  price: number;
  status: OrderStatus;
  createdAt: string;
  paymentMethod: string;
}

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Preparing: "bg-blue-100 text-blue-800 border-blue-200",
  Ready: "bg-green-100 text-green-800 border-green-200",
  Delivered: "bg-gray-100 text-gray-800 border-gray-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

export default function SellerOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(4);
  const [newNotification, setNewNotification] = useState(false);

  useEffect(() => {
    socket.on("connection");
    socket.on("orderId", (orderId) => {
      setNewNotification(true);
    });
  }, []);

  // Pagination logic with ellipses
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, page - halfVisible);
    let endPage = Math.min(totalPages, page + halfVisible);

    // Adjust if we're near the beginning or end
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage(1);
            }}
            className={page === 1 ? "bg-primary text-primary-foreground" : ""}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage(i);
            }}
            className={page === i ? "bg-primary text-primary-foreground" : ""}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage(totalPages);
            }}
            className={
              page === totalPages ? "bg-primary text-primary-foreground" : ""
            }
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
        { status: newStatus }
      );
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const {
        data: { orders, totalDbOrders },
      } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders?pageSize=5&page=${page}`
      );
      setOrders(orders);
      setTotalPages(Math.ceil(totalDbOrders / 5)); // Assuming pageSize is 5
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "Preparing":
        return <ChefHat className="h-4 w-4" />;
      case "Ready":
        return <Bell className="h-4 w-4" />;
      default:
        return null;
<<<<<<< HEAD
=======
const orders = [
  { id: "ORD-2024-001", customer: "Sarah Johnson", date: "2024-06-25", total: 479.97, items: ["Premium Headphones (x2)", "Bluetooth Speaker (x1)"], status: "Pending" },
  { id: "ORD-2024-002", customer: "Michael Chen", date: "2024-06-24", total: 289.95, items: ["Wireless Mouse (x3)", "USB-C Cable (x2)"], status: "Processing" },
  { id: "ORD-2024-003", customer: "Emily Davis", date: "2024-06-23", total: 199.99, items: ["Smart Watch (x1)"], status: "Shipped" },
  { id: "ORD-2024-004", customer: "John Smith", date: "2024-06-22", total: 349.50, items: ["Gaming Keyboard (x1)", "Mouse Pad (x1)"], status: "Delivered" },
  { id: "ORD-2024-005", customer: "Anna Lee", date: "2024-06-21", total: 150.00, items: ["Power Bank (x1)"], status: "Cancelled" },
]

const Orders = () => {
  const getStatusCount = (status) => orders.filter(order => order.status === status).length;
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700";
      case "Processing": return "bg-gradient-to-r from-orange-200 to-orange-300 text-orange-800";
      case "Shipped": return "bg-gradient-to-r from-orange-300 to-orange-400 text-orange-900";
      case "Delivered": return "bg-gradient-to-r from-orange-400 to-orange-500 text-white";
      case "Cancelled": return "bg-gradient-to-r from-orange-500 to-orange-600 text-white";
      default: return "bg-gray-100 text-gray-700";
>>>>>>> 3cc67fad624dfd05f7b615060c607d42cc077eeb
    }
  };

  const pendingCount = 12
  const preparingCount = 100
  const readyCount = 20
  const todayRevenue =123312
  return (
<<<<<<< HEAD
    <div className="min-h-screen  w-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order Management
              </h1>
              <p className="text-gray-600">Manage your restaurant orders</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                <Bell className="h-4 w-4 mr-1" />
                {pendingCount + preparingCount} Active Orders
              </Badge>
            </div>
=======
    <div className="px-6 py-8 w-full bg-gradient-to-br from-white to-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <span className="text-3xl font-extrabold text-orange-600">📦</span>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Order Management</h1>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg shadow-inner text-center">
            <p className="text-gray-600 font-medium">Total Orders</p>
            <p className="text-3xl font-bold text-orange-700 mt-2">{orders.length}</p>
            <span className="text-2xl text-orange-600">📦</span>
          </div>
          <div className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg shadow-inner text-center">
            <p className="text-gray-600 font-medium">Pending</p>
            <p className="text-3xl font-bold text-orange-700 mt-2">{getStatusCount("Pending")}</p>
            <span className="text-2xl text-orange-600">⏰</span>
          </div>
          <div className="p-4 bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg shadow-inner text-center">
            <p className="text-gray-700 font-medium">Processing</p>
            <p className="text-3xl font-bold text-orange-800 mt-2">{getStatusCount("Processing")}</p>
            <span className="text-2xl text-orange-700">📦</span>
          </div>
          <div className="p-4 bg-gradient-to-r from-orange-300 to-orange-400 rounded-lg shadow-inner text-center">
            <p className="text-gray-800 font-medium">Shipped</p>
            <p className="text-3xl font-bold text-orange-900 mt-2">{getStatusCount("Shipped")}</p>
            <span className="text-2xl text-orange-800">🚚</span>
          </div>
          <div className="p-4 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg shadow-inner text-center">
            <p className="text-gray-900 font-medium">Delivered</p>
            <p className="text-3xl font-bold text-white mt-2">{getStatusCount("Delivered")}</p>
            <span className="text-2xl text-white">✅</span>
          </div>
          <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-inner text-center">
            <p className="text-white font-medium">Cancelled</p>
            <p className="text-3xl font-bold text-white mt-2">{getStatusCount("Cancelled")}</p>
            <span className="text-2xl text-white">❌</span>
>>>>>>> 3cc67fad624dfd05f7b615060c607d42cc077eeb
=======
    }
  };

  const pendingCount = 12;
  const preparingCount = 100;
  const readyCount = 20;
  const todayRevenue = 123312;

  return (
    <div className="min-h-screen  w-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order Management
              </h1>
              <p className="text-gray-600">Manage your restaurant orders</p>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className="relative cursor-pointer"
                onClick={() => setNewNotification(false)}
              >
                <Bell className="w-6 h-6" />
                {newNotification && (
                  <div className="bg-red-600 w-2 h-2 rounded-full absolute top-0.5 left-4" />
                )}
              </div>
              <Badge variant="outline" className="text-sm">
                <Bell className="h-4 w-4 mr-1" />
                {pendingCount + preparingCount} Active Orders
              </Badge>
            </div>
>>>>>>> 447a190aabf8db9367714cb8458c1572ade9f77f
          </div>
        </div>
      </div>

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 447a190aabf8db9367714cb8458c1572ade9f77f
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Pending Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ChefHat className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Preparing</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {preparingCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bell className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ready</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {readyCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Today's Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">321</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by customer email or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Preparing">Preparing</SelectItem>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders 31232</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order._id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">
                              {order.bookedById.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          name
                          {/* {order.items.slice(0, 2).map((item) => (
                            <div key={item._id} className="text-sm">
                              {item.quantity}x {item.name}
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-sm text-gray-500">+{order.items.length - 2} more items</div>
                          )} */}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">312</TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            statusColors[order.status]
                          } flex items-center w-fit`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">
                            {order.status}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>
                            {new Date(order.createdAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {order.status === "Pending" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateOrderStatus(order._id, "Preparing")
                                  }
                                >
                                  Start Preparing
                                </DropdownMenuItem>
                              )}
                              {order.status === "Preparing" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateOrderStatus(order._id, "Ready")
                                  }
                                >
                                  Mark as Ready
                                </DropdownMenuItem>
                              )}
                              {order.status === "Ready" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateOrderStatus(order._id, "Delivered")
                                  }
                                >
                                  Mark as Delivered
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() =>
                                  updateOrderStatus(order._id, "Cancelled")
                                }
                              >
                                Cancel Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {generatePaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) setPage(page + 1);
                    }}
                    className={
                      page === totalPages ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>

        {/* Order Details Modal/Card */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Order Details - {selectedOrder._id}</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p>
                      <strong>Email:</strong> {selectedOrder.bookedById.email}
                    </p>
                    <p>
                      <strong>Payment Method:</strong>{" "}
                      {selectedOrder.paymentMethod}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">321321</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span>32132</span>
                  </div>
                </div>

                {/* Status Update Actions */}
                <div className="flex gap-2 pt-4">
                  {selectedOrder.status === "Pending" && (
                    <Button
                      onClick={() => {
                        updateOrderStatus(selectedOrder._id, "Preparing");
                        setSelectedOrder(null);
                      }}
                    >
                      Start Preparing
                    </Button>
                  )}
                  {selectedOrder.status === "Preparing" && (
                    <Button
                      onClick={() => {
                        updateOrderStatus(selectedOrder._id, "Ready");
                        setSelectedOrder(null);
                      }}
                    >
                      Mark as Ready
                    </Button>
                  )}
                  {selectedOrder.status === "Ready" && (
                    <Button
                      onClick={() => {
                        updateOrderStatus(selectedOrder._id, "Delivered");
                        setSelectedOrder(null);
                      }}
                    >
                      Mark as Delivered
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => {
                      updateOrderStatus(selectedOrder._id, "Cancelled");
                      setSelectedOrder(null);
                    }}
                  >
                    Cancel Order
                  </Button>
                </div>
              </CardContent>
            </Card>
<<<<<<< HEAD
=======
          <div className="bg-orange-300 p-6 rounded-xl shadow-lg mb-8 flex items-center justify-center">
            <div className="flex items-center  justify-between space-x-4 w-full ">
              <input
                type="text"
                placeholder="Search by Order ID or Customer Name..."
                className="w-full max-w-md p-3 border border-orange-200 rounded-lg bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder-gray-400"
              />
              <select className="p-3 border border-orange-200 rounded-lg bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600">
                <option>All Status</option>
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
>>>>>>> 3cc67fad624dfd05f7b615060c607d42cc077eeb
=======
>>>>>>> 447a190aabf8db9367714cb8458c1572ade9f77f
          </div>
        )}
      </div>
    </div>
  );
}
