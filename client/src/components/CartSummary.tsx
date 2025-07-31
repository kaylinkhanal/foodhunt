import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
  onCheckout: () => void;
}

export const CartSummary = ({
  subtotal,
  deliveryFee,
  total,
  itemCount,
  onCheckout,
}: CartSummaryProps) => {
  return (
    <Card className="p-6 shadow-elegant sticky top-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Order Summary</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Subtotal ({itemCount} items)
          </span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span className="font-medium">${deliveryFee.toFixed(2)}</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-orange-500">${total.toFixed(2)}</span>
        </div>
      </div>

      <Button 
        onClick={onCheckout}
        className="w-full cursor-pointer mt-6 text-lg py-6 premium bg-orange-500 hover:bg-orange-400"
        size="lg"
      >
        Proceed to Checkout
      </Button>
      
      <p className="text-xs text-muted-foreground text-center mt-3">
        Free delivery on orders over $30
      </p>
    </Card>
  );
};