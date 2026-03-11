"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const Landing = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 selection:bg-primary/30">
      {/* Ambient glow behind circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative flex flex-col items-center gap-8 "
      >
        {/* Breathing glow ring */}
        <motion.div
          animate={{
            boxShadow: [
              "0 0 40px hsl(152 60% 52% / 0.15), 0 0 80px hsl(152 60% 52% / 0.05)",
              "0 0 60px hsl(152 60% 52% / 0.3), 0 0 120px hsl(152 60% 52% / 0.1)",
              "0 0 40px hsl(152 60% 52% / 0.15), 0 0 80px hsl(152 60% 52% / 0.05)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full"
          style={{ top: "-20px", bottom: "80px", left: "-20px", right: "-20px" }}
        />

        {/* Guru circle button */}
        <motion.button
          onClick={() => router.push("/tracker")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 flex h-64 w-64 items-center justify-center overflow-hidden rounded-full border-2 border-primary/30 bg-card transition-colors hover:border-primary/60 md:h-80 md:w-80"
          style={{ boxShadow: "var(--glow-primary)" }}
        >
          {/* Floating animation */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/guru-meditate.png"
              alt="Meditating Guru"
              width={240}
              height={240}
              className="h-48 w-48 object-contain md:h-60 md:w-60 text"
              priority
            />
          </motion.div>
        </motion.button>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center "
        >
          <h1
            className="text-5xl  tracking-tight text-foreground md:text-6xl "
            style={{ fontFamily: "var(--font-display)" }}
          >
            Guru
          </h1>

          <motion.p
            className="mt-3 text-sm text-muted-foreground"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Click the Guru to begin your journey
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;