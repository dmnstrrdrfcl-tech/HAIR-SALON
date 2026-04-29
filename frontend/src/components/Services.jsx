import { motion } from "framer-motion";
import { Scissors, Palette, Sparkles, Droplet, ArrowUpRight } from "lucide-react";

const ICONS = { scissors: Scissors, palette: Palette, sparkles: Sparkles, droplet: Droplet };

export default function Services({ services }) {
  return (
    <section id="servicios" data-testid="services-section" className="relative py-28 lg:py-40 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="gold-line" />
              <span className="overline text-primary">Lo que hacemos</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-[1.05] max-w-2xl">
              Servicios diseñados con <span className="italic text-primary">intención</span>.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Cada servicio es una conversación. Escuchamos, analizamos y creamos
            un resultado que potencie tu identidad única.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {services.map((s, i) => {
            const Icon = ICONS[s.icon] || Scissors;
            return (
              <motion.a
                href="#reservas"
                key={s.id}
                data-testid={`service-card-${s.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="group relative bg-background hover:bg-secondary transition-colors p-10 flex flex-col min-h-[360px]"
              >
                <div className="flex items-start justify-between mb-10">
                  <div className="w-14 h-14 rounded-full border border-border group-hover:border-primary group-hover:bg-primary/10 transition-all flex items-center justify-center">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <ArrowUpRight
                    size={20}
                    className="text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition-all duration-500"
                  />
                </div>

                <h3 className="text-2xl font-medium mb-3 leading-tight">{s.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.description}</p>

                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between text-xs uppercase tracking-widest">
                  <span className="text-muted-foreground">{s.duration} min</span>
                  <span className="text-primary font-medium">Desde {s.price}€</span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
