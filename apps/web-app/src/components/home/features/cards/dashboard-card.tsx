"use client";

import { motion } from "motion/react";
import { DashboardMockup } from "./dashboard-mockup";

export function DashboardCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="card h-full"
    >
      <DashboardMockup />
    </motion.div>
  );
}
