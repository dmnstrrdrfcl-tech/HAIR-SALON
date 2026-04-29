import { Instagram, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="relative border-t border-border bg-secondary/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="font-[Playfair_Display] text-xl tracking-[0.3em] mb-4">SERENDIPITY</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hair atelier en Madrid. Una experiencia cinemática de belleza desde 2015.
          </p>
        </div>

        <div>
          <div className="overline text-primary mb-4">Horarios</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex justify-between"><span>Lun – Vie</span><span className="text-foreground">09:00 — 20:00</span></li>
            <li className="flex justify-between"><span>Sábados</span><span className="text-foreground">10:00 — 18:00</span></li>
            <li className="flex justify-between"><span>Domingos</span><span>Cerrado</span></li>
          </ul>
        </div>

        <div>
          <div className="overline text-primary mb-4">Contacto</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Calle Serrano 42</li>
            <li>28001 Madrid</li>
            <li>+34 911 23 45 67</li>
            <li>hola@serendipity.com</li>
          </ul>
        </div>

        <div>
          <div className="overline text-primary mb-4">Síguenos</div>
          <div className="flex items-center gap-3">
            {[
              { Icon: Instagram, href: "https://instagram.com", label: "instagram" },
              { Icon: Facebook, href: "https://facebook.com", label: "facebook" },
              { Icon: Youtube, href: "https://youtube.com", label: "youtube" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                data-testid={`social-${label}`}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 border border-border hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Serendipity Hair Atelier. Todos los derechos reservados.</span>
          <span className="overline">Crafted with intention</span>
        </div>
      </div>
    </footer>
  );
}
