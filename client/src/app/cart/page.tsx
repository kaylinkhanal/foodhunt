'use client'

// import React from 'react'
// import { useSelector } from 'react-redux'

// const Cart = () => {

//     const {cart} = useSelector(state=>state.product)

//     return (
//         <div>
//             {JSON.stringify(cart)}
//         </div>
//     )
// }

// export default Cart



import { useState } from "react";
import { CartItem } from "@/components/CartItem";
import { CartSummary } from "@/components/CartSummary";
import { EmptyCart } from "@/components/EmptyCart";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { toast } from "sonner"
import { useSelector } from "react-redux";

interface CartItemType {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    }



const Cart = () => {
const {aggregatedCart : cartItems} = useSelector(state=>state.product)


const handleCheckout = () => {
    toast("Redirecting to payment...");
};

// const handleContinueShopping = () => {
//     // Reset cart with sample items for demo
//     setCartItems(initialCartItems);
//     toast("Browse our delicious menu.");
// };

const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
const deliveryFee = 3.99;
const total = subtotal + deliveryFee;
const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

return (
    <div className="min-h-screen bg-gradient-subtle">
    {/* Header */}
    <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="p-2">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-orange-500">
                        FoodHunt
                        </h1>
                        <p className="text-sm text-muted-foreground">Your cart</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-5 h-5 text-orange-500" />
                    <span className="font-semibold">{totalItems} items</span>
                </div>
            </div>
        </div>
    </header>

    <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
        <div className="max-w-md mx-auto">
            {/* <EmptyCart onContinueShopping={handleContinueShopping} /> */}
            <EmptyCart/>
        </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
            {cartItems.map((item, id) => (
                <CartItem
                key={id}
                {...item}
                // onUpdateQuantity={handleUpdateQuantity}
                // onRemove={handleRemoveItem}
                />
            ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
            <CartSummary
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
                itemCount={totalItems}
                onCheckout={handleCheckout}
            />
            </div>
        </div>
        )}
    </div>
    </div>
);
};

export default Cart;
