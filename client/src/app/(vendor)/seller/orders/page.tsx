"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bell, ChefHat, Clock, DollarSign, Eye, MoreHorizontal, Phone, Search, User } from "lucide-react"

type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | "cancelled"

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  notes?: string
}

interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  orderTime: string
  estimatedTime?: string
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "ram sharma",
    customerPhone: "9801234567",
    customerAddress: "fresh frams",
    items: [
      { id: "1", name: "Margherita Pizza", quantity: 2, price: 24.98 },
      { id: "2", name: "Caesar Salad", quantity: 1, price: 12.99 },
      { id: "3", name: "Garlic Bread", quantity: 1, price: 6.99 },
    ],
    total: 44.96,
    status: "pending",
    orderTime: "2024-01-15 12:30 PM",
    estimatedTime: "45 min",
  },
  {
    id: "ORD-002",
    customerName: "Sarah sharma",
    customerPhone: "987226543",
    customerAddress: "tinkune chowk ",
    items: [
      { id: "4", name: "Chicken Burger", quantity: 1, price: 15.99 },
      { id: "5", name: "French Fries", quantity: 2, price: 11.98 },
      { id: "6", name: "Coca Cola", quantity: 2, price: 5.98 },
    ],
    total: 33.95,
    status: "preparing",
    orderTime: "2024-01-15 12:15 PM",
    estimatedTime: "30 min",
  },
  {
    id: "ORD-003",
    customerName: "khusi sharma",
    customerPhone: "9014567890",
    customerAddress: "sinamangal",
    items: [
      { id: "7", name: "Spaghetti Carbonara", quantity: 1, price: 18.99 },
      { id: "8", name: "Tiramisu", quantity: 1, price: 8.99 },
    ],
    total: 27.98,
    status: "ready",
    orderTime: "2024-01-15 11:45 AM",
    estimatedTime: "Ready",
  },
  {
    id: "ORD-004",
    customerName: "Rita karki",
    customerPhone: "9823210987",
    customerAddress: "gwarko,stupa",
    items: [
      { id: "9", name: "Vegetable Stir Fry", quantity: 1, price: 16.99 },
      { id: "10", name: "Spring Rolls", quantity: 3, price: 14.97 },
    ],
    total: 31.96,
    status: "delivered",
    orderTime: "2024-01-15 11:30 AM",
  },
]

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  preparing: "bg-blue-100 text-blue-800 border-blue-200",
  ready: "bg-green-100 text-green-800 border-green-200",
  delivered: "bg-gray-100 text-gray-800 border-gray-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

export default function SellerOrderPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "preparing":
        return <ChefHat className="h-4 w-4" />
      case "ready":
        return <Bell className="h-4 w-4" />
      default:
        return null
    }
  }

  const pendingCount = orders.filter((o) => o.status === "pending").length
  const preparingCount = orders.filter((o) => o.status === "preparing").length
  const readyCount = orders.filter((o) => o.status === "ready").length
  const todayRevenue = orders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-600">Manage your restaurant orders</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                <Bell className="h-4 w-4 mr-1" />
                {pendingCount + preparingCount} Active Orders
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{preparingCount}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{readyCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${todayRevenue.toFixed(2)}</p>
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
                  placeholder="Search by customer name or order ID..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {order.customerPhone}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.items.slice(0, 2).map((item) => (
                            <div key={item.id} className="text-sm">
                              {item.quantity}x {item.name}
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-sm text-gray-500">+{order.items.length - 2} more items</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[order.status]} flex items-center w-fit`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{order.orderTime}</p>
                          {order.estimatedTime && <p className="text-gray-500">Est: {order.estimatedTime}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {order.status === "pending" && (
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "preparing")}>
                                  Start Preparing
                                </DropdownMenuItem>
                              )}
                              {order.status === "preparing" && (
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "ready")}>
                                  Mark as Ready
                                </DropdownMenuItem>
                              )}
                              {order.status === "ready" && (
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "delivered")}>
                                  Mark as Delivered
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "cancelled")}>
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
          </CardContent>
        </Card>

        {/* Order Details Modal/Card */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Order Details - {selectedOrder.id}</CardTitle>
                  <Button variant="outline" onClick={() => setSelectedOrder(null)}>
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
                      <strong>Name:</strong> {selectedOrder.customerName}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedOrder.customerPhone}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedOrder.customerAddress}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          {item.notes && <p className="text-sm text-gray-600">Notes: {item.notes}</p>}
                        </div>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Status Update Actions */}
                <div className="flex gap-2 pt-4">
                  {selectedOrder.status === "pending" && (
                    <Button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, "preparing")
                        setSelectedOrder(null)
                      }}
                    >
                      Start Preparing
                    </Button>
                  )}
                  {selectedOrder.status === "preparing" && (
                    <Button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, "ready")
                        setSelectedOrder(null)
                      }}
                    >
                      Mark as Ready
                    </Button>
                  )}
                  {selectedOrder.status === "ready" && (
                    <Button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, "delivered")
                        setSelectedOrder(null)
                      }}
                    >
                      Mark as Delivered
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, "cancelled")
                      setSelectedOrder(null)
                    }}
                  >
                    Cancel Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
