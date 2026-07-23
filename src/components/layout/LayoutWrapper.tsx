"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Do not show Navbar/Footer on the interview screen because it has its own header.
  const hideLayout = pathname.startsWith("/interview");

  return (
    <>
      {!hideLayout && <Navbar />}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex flex-col flex-1"
        >
          {children}
        </motion.div>
      </AnimatePresence>
      {!hideLayout && <Footer />}
    </>
  );
}
