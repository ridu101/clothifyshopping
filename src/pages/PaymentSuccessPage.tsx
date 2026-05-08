import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";

const PaymentSuccessPage = () => {
  const [params] = useSearchParams();
  const orderId = params.get("order") ?? "";
  const { clearCart } = useCart();
  const { fetchAllOrders } = useOrders();
  useEffect(() => { clearCart(); fetchAllOrders(); }, []);

  return (
    <div className="min-h-screen pt-28 px-6 max-w-3xl mx-auto pb-20 flex items-center justify-center">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel rounded-3xl p-10 text-center bg-white/80 backdrop-blur-2xl border border-white/60 max-w-lg w-full"
        style={{ boxShadow: "0 30px 80px rgba(120,116,236,0.3)" }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
          <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-4" />
        </motion.div>
        <h1 className="font-heading text-3xl font-bold mb-2 text-foreground">Payment Successful</h1>
        <p className="text-sm text-muted-foreground mb-2">Thank you for shopping with Clothify.</p>
        {orderId && <p className="text-xs font-mono text-primary mb-6">Order #{orderId.slice(0,8)}</p>}
        <div className="flex gap-3 justify-center">
          <Link to="/profile" className="neon-button px-6 py-3 text-sm">View My Orders</Link>
          <Link to="/shop" className="neon-button-outline px-6 py-3 text-sm">Continue Shopping</Link>
        </div>
      </motion.div>
    </div>
  );
};
export default PaymentSuccessPage;
