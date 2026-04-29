import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Testimonials({ items }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!items?.length) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items]);

  if (!items?.length) return null;
  const t = items[i];

  return (
    <section
      data-testid="testimonials-section"
      className="relative py-28 lg:py-40 px-6 lg:px-10 overflow-hidden"
    >
      {/* Marquee */}
      <div className="absolute top-10 left-0 right-0 opacity-[0.035] pointer-events-none overflow-hidden">
        <div className="marquee font-[Playfair_Display] text-[16vw] leading-none tracking-tighter">
          <span>Experience · Elegance · Excellence ·&nbsp;</span>
          <span>Experience · Elegance · Excellence ·&nbsp;</span>
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="gold-line" />
          <span className="overline text-primary">Lo que dicen</span>
          <span className="gold-line" />
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-16">
          Palabras de <span className="italic text-primary">nuestros clientes</span>
        </h2>

        <div className="relative min-h-[260px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              data-testid={`testimonial-${t.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <Quote className="mx-auto text-primary mb-6" size={36} />
              <p className="text-xl md:text-2xl lg:text-3xl font-[Playfair_Display] italic leading-relaxed text-foreground">
                "{t.text}"
              </p>
              <div className="mt-8 flex items-center justify-center gap-1">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Star key={k} size={14} className="fill-primary text-primary" />
                ))}
              </div>
              <div className="mt-4 text-sm uppercase tracking-widest">
                <span className="font-medium">{t.name}</span>
                <span className="text-muted-foreground"> · {t.service}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-12">
          {items.map((_, k) => (
            <button
              key={k}
              data-testid={`testimonial-dot-${k}`}
              onClick={() => setI(k)}
              className={`h-1 transition-all ${
                k === i ? "w-10 bg-primary" : "w-4 bg-border hover:bg-primary/50"
              }`}
              aria-label={`testimonial ${k + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
