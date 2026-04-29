import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

const HERO_IMG =
  "https://images.pexels.com/photos/7750115/pexels-photo-7750115.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1800";

export default function Hero() {
  return (
    <section
      id="inicio"
      data-testid="hero-section"
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden grain"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <div
          className="hero-ken absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 h-full flex items-end lg:items-center pb-20 lg:pb-0 pt-28">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="gold-line" />
            <span className="overline text-primary">Atelier de peluquería · Madrid</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25 }}
            className="text-5xl sm:text-6xl lg:text-[5.5rem] leading-[0.95] tracking-tighter font-semibold"
          >
            Transformamos <br />
            <span className="italic font-normal text-primary">tu estilo</span>, elevamos <br />
            tu presencia.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed"
          >
            Una experiencia cinemática de belleza. Cortes, color y tratamientos
            diseñados por un equipo obsesionado con el detalle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#reservas"
              data-testid="hero-book-btn"
              className="btn-gold inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 h-14 text-sm uppercase tracking-[0.25em] font-medium"
            >
              Reservar cita <ArrowRight size={16} />
            </a>
            <a
              href="#servicios"
              data-testid="hero-services-btn"
              className="inline-flex items-center gap-3 border border-border hover:border-primary hover:text-primary transition-colors px-8 h-14 text-sm uppercase tracking-[0.25em]"
            >
              Ver servicios
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="mt-12 flex items-center gap-6 text-sm"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-primary text-primary" />
              ))}
            </div>
            <span className="text-muted-foreground">
              4.9 · <span className="text-foreground">+2,400 clientes satisfechos</span>
            </span>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-muted-foreground">
        <span className="overline">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-primary to-transparent animate-pulse" />
      </div>
    </section>
  );
}
