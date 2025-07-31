import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
id: string;
name: string;
price: number;
image: string;
quantity: number;
onUpdateQuantity: (id: string, quantity: number) => void;
onRemove: (id: string) => void;
}

export const CartItem = ({
id,
name,
discountedPrice,
image,
quantity,
onUpdateQuantity,
onRemove,
}: CartItemProps) => {
const [isAnimating, setIsAnimating] = useState(false);

const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
    onRemove(id);
    return;
    }
    setIsAnimating(true);
    onUpdateQuantity(id, newQuantity);
    setTimeout(() => setIsAnimating(false), 200);
};

return (
    <Card className="p-4 transition-all duration-300 hover:shadow-elegant animate-fade-in">
    <div className="flex items-center gap-4">
        <div className="relative overflow-hidden rounded-lg w-16 h-16 flex-shrink-0">
        <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        </div>
        
        <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">{name}</h3>
        <p className="text-orange-500 font-bold">{discountedPrice}</p>
        </div>

        <div className="flex items-center gap-2">
        <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(quantity - 1)}
            className="h-8 w-8 p-0 rounded-full cursor-pointer"
            disabled={quantity <= 1}
        >
            <Minus className="h-3 w-3" />
        </Button>
        
        <span 
            className={`w-8 text-center font-semibold ${
            isAnimating ? 'animate-scale-in' : ''
            }`}
        >
            {quantity}
        </span>
        
        <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(quantity + 1)}
            className="h-8 w-8 p-0 rounded-full cursor-pointer"
        >
            <Plus className="h-3 w-3" />
        </Button>
        </div>

        <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(id)}
        className="h-8 cursor-pointer w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
        <Trash2 className="h-4 w-4" />
        </Button>
    </div>
    </Card>
);
};