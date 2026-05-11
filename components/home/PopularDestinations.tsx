"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, MapPin, PlaneTakeoff } from "lucide-react";

import { Button } from "@/components/ui/button";

const destinations = [
  {
    city: "Tokyo",
    country: "Japan",
    code: "NRT",
    image: "/images/tokyo.jpg",
    price: "from ₱12,499",
    tag: "City Escape",
    description: "Neon nights and timeless city stays.",
    imagePosition: "center center",
  },
  {
    city: "Seoul",
    country: "South Korea",
    code: "ICN",
    image: "/images/seoul.jpg",
    price: "from ₱9,899",
    tag: "Culture Route",
    description: "Modern skyline and curated food trips.",
    imagePosition: "center center",
  },
  {
    city: "Singapore",
    country: "Singapore",
    code: "SIN",
    image: "/images/singapore.jpg",
    price: "from ₱7,499",
    tag: "Premium Stay",
    description: "A polished destination for leisure.",
    imagePosition: "center center",
  },
  {
    city: "Bangkok",
    country: "Thailand",
    code: "BKK",
    image: "/images/bangkok.jpg",
    price: "from ₱6,999",
    tag: "Weekend Trip",
    description: "Vibrant streets and skyline escapes.",
    imagePosition: "center center",
  },
];

export default function PopularDestinations() {
  return (
    <section className="relative overflow-hidden bg-[#050706] px-4 py-28 text-white sm:px-6">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-white/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-white/40">
              Popular destinations
            </p>

            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
              Curated routes for your next escape.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          >
            <Button
              asChild
              variant="outline"
              className="w-fit rounded-full border-white/15 bg-white/5 px-6 text-white backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
            >
              <Link href="/flights">
                View all routes
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.city}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                delay: index * 0.08,
                duration: 0.7,
                ease: "easeOut",
              }}
            >
              <Link
                href="/flights"
                className="group block"
                aria-label={`View flights to ${destination.city}`}
              >
                <div className="relative h-[430px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 backdrop-blur-xl transition duration-500 ease-out group-hover:border-white/20 group-hover:bg-white/[0.07] md:h-[470px]">
                  <Image
                    src={destination.image}
                    alt={`${destination.city}, ${destination.country}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    style={{ objectPosition: destination.imagePosition }}
                    className="object-cover transition duration-700 ease-out group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />
                  <div className="absolute inset-0 bg-black/10 transition duration-500 group-hover:bg-black/0" />
                  <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />

                  <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/85 shadow-lg shadow-black/20 backdrop-blur-xl">
                    <PlaneTakeoff className="h-3.5 w-3.5" />
                    {destination.tag}
                  </div>

                  <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-xs text-white/75 shadow-lg shadow-black/20 backdrop-blur-xl">
                    <MapPin className="h-3.5 w-3.5" />
                    {destination.code}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70 backdrop-blur-xl">
                      {destination.country}
                    </div>

                    <h3 className="text-4xl font-semibold tracking-[-0.05em] text-white">
                      {destination.city}
                    </h3>

                    <p className="mt-2 line-clamp-2 max-w-[14rem] text-sm leading-6 text-white/60">
                      {destination.description}
                    </p>

                    <div className="mt-6 flex items-center gap-2.5">
                      <div className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl">
                        <p className="text-xs text-white/45">One-way fares</p>
                        <p className="text-base font-medium text-white">
                          {destination.price}
                        </p>
                      </div>

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-xl shadow-black/30 transition duration-300 group-hover:scale-110">
                        <ArrowUpRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}