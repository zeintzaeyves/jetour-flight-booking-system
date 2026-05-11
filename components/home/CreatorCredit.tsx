"use client";

import { motion } from "motion/react";

export default function CreatorCredit() {
  return (
    <section className="bg-[#050706] px-4 py-28 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center"
        >
          <p className="text-sm text-white/35 md:text-base">
            A concept designed and developed by
          </p>

          <h2 className="mt-8 text-6xl font-semibold tracking-[-0.08em] text-white sm:text-7xl md:text-8xl lg:text-[9rem]">
            Zein Khalid
          </h2>
        </motion.div>

        <div className="mt-28 border-t border-white/10 pt-8">
          <div className="flex flex-col justify-between gap-6 text-sm text-white/35 md:flex-row md:items-center">
            <p>©2026 Zein Khalid Bulaclac. All rights reserved.</p>

            <div className="flex items-center gap-8">
              <a href="https://www.instagram.com/zeintzaeyves/" className="transition hover:text-white">
                Instagram
              </a>
              <a href="https://www.facebook.com/zeintzaeyves" className="transition hover:text-white">
                Facebook
              </a>
              <a href="https://www.linkedin.com/in/zeinkhalid/" className="transition hover:text-white">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}