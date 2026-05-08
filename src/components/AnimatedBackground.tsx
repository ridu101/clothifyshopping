import { motion } from "framer-motion";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base mesh gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 10%, #EEEBFF 0%, transparent 55%), radial-gradient(ellipse at 80% 90%, #E0DCFF 0%, transparent 55%), linear-gradient(180deg, #F8F9FF 0%, #FFFFFF 100%)",
        }}
      />

      {/* Floating purple blobs */}
      <motion.div
        className="absolute w-[640px] h-[640px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(120,116,236,0.45) 0%, transparent 70%)",
          top: "-8%",
          left: "-6%",
          filter: "blur(80px)",
        }}
        animate={{ x: [0, 80, -40, 0], y: [0, -50, 40, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[720px] h-[720px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(159,156,247,0.4) 0%, transparent 70%)",
          bottom: "-12%",
          right: "-8%",
          filter: "blur(90px)",
        }}
        animate={{ x: [0, -60, 30, 0], y: [0, 40, -30, 0], scale: [1, 0.95, 1.08, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[420px] h-[420px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(196,193,255,0.35) 0%, transparent 70%)",
          top: "40%",
          left: "55%",
          filter: "blur(70px)",
        }}
        animate={{ x: [0, 50, -50, 0], y: [0, -40, 30, 0], scale: [1, 1.15, 0.9, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle particles */}
      {[...Array(14)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: "rgba(120,116,236,0.55)",
            top: `${(i * 53) % 100}%`,
            left: `${(i * 37) % 100}%`,
            boxShadow: "0 0 12px rgba(120,116,236,0.6)",
          }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 6 + (i % 5), repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
        />
      ))}

      {/* Glass overlay tint */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
    </div>
  );
};

export default AnimatedBackground;
