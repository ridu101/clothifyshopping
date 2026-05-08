import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const PaymentFailPage = () => {
  const [params] = useSearchParams();
  const orderId = params.get("order") ?? "";
  return (
    <div className="min-h-screen pt-28 px-6 max-w-3xl mx-auto pb-20 flex items-center justify-center">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel rounded-3xl p-10 text-center bg-white/80 backdrop-blur-2xl border border-white/60 max-w-lg w-full"
        style={{ boxShadow: "0 30px 80px rgba(239,68,68,0.25)" }}>
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
        <h1 className="font-heading text-3xl font-bold mb-2 text-foreground">Payment Failed</h1>
        <p className="text-sm text-muted-foreground mb-2">Something went wrong. Please try again.</p>
        {orderId && <p className="text-xs font-mono text-red-500 mb-6">Order #{orderId.slice(0,8)}</p>}
        <div className="flex gap-3 justify-center">
          <Link to="/cart" className="neon-button px-6 py-3 text-sm">Try Again</Link>
          <Link to="/" className="neon-button-outline px-6 py-3 text-sm">Go Home</Link>
        </div>
      </motion.div>
    </div>
  );
};
export default PaymentFailPage;
