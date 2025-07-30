import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export const EmptyCart = () => {
  const router = useRouter(); 

  const onContinueShopping = () => {
    router.push("/");
  };

  return (
    <Card className="p-12 text-center shadow-elegant animate-fade-in">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
          <ShoppingCart className="w-12 h-12 text-primary-foreground bg-orange-500 h-22 w-22 rounded-full p-5" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Your cart is empty</h2>
          <p className="text-muted-foreground max-w-md">
            Looks like you haven't added any delicious food to your cart yet. 
            Browse our menu and discover amazing dishes!
          </p>
        </div>

        <Button 
          onClick={onContinueShopping}
          className="premium text-lg px-8 py-6 bg-orange-500 cursor-pointer hover:bg-[rgb(249,116,21)] transition-colors"
          size="lg"
        >
          Start Shopping
        </Button>
      </div>
    </Card>
  );
};
