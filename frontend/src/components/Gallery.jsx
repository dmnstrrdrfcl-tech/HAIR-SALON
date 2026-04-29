import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { X } from "lucide-react";

export default function Gallery({ items }) {
  const [active, setActive] = useState(null);

  // Bento heights
  const heights = ["h-72", "h-96", "h-64", "h-80", "h-96", "h-72", "h-80", "h-64"];

  return (
    <section id="galeria" data-testid="gallery-section" className="relative py-28 lg:py-40 px-6 lg:px-10 bg-secondary/40">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="gold-line" />
              <span className="overline text-primary">Portfolio</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-[1.05]">
              Una colección de <span className="italic text-primary">transformaciones</span>.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Explora nuestros trabajos más recientes. Cada imagen cuenta una historia de cambio y confianza.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {items.map((g, i) => (
            <motion.button
              key={g.id}
              data-testid={`gallery-item-${g.id}`}
              onClick={() => setActive(g)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
              className={`gallery-item relative block w-full overflow-hidden break-inside-avoid ${heights[i % heights.length]} group`}
            >
              <img
                src={g.url}
                alt={g.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-left opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <span className="overline text-primary">{g.category}</span>
                <div className="font-[Playfair_Display] text-xl text-white mt-1">{g.title}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent
          data-testid="gallery-lightbox"
          className="max-w-5xl p-0 border-primary/30 bg-background overflow-hidden rounded-none"
        >
          {active && (
            <div className="relative">
              <DialogTitle className="sr-only">{active.title}</DialogTitle>
              <DialogDescription className="sr-only">{active.category} — {active.title}</DialogDescription>
              <img src={active.url} alt={active.title} className="w-full max-h-[85vh] object-contain bg-black" />
              <button
                data-testid="gallery-close"
                onClick={() => setActive(null)}
                className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-white">
                <span className="overline text-primary">{active.category}</span>
                <div className="font-[Playfair_Display] text-2xl mt-1">{active.title}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
