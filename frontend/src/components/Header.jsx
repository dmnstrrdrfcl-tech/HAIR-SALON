import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeProvider";

const NAV = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#galeria", label: "Galería" },
  { href: "#reservas", label: "Reservas" },
  { href: "#contacto", label: "Contacto" },
];

export default function Header() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-background/70 border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
        <a href="#inicio" data-testid="brand-logo" className="flex items-center gap-2 group">
          <span className="font-[Playfair_Display] text-xl md:text-2xl tracking-[0.25em] font-semibold">
            SERENDIPITY
          </span>
          <span className="hidden md:inline w-1.5 h-1.5 rounded-full bg-primary group-hover:scale-150 transition-transform" />
        </a>

        <nav className="hidden lg:flex items-center gap-10">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              data-testid={`nav-${n.label.toLowerCase()}`}
              className="text-sm tracking-wide hover:text-primary transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            data-testid="theme-toggle"
            onClick={toggle}
            aria-label="Alternar tema"
            className="w-10 h-10 rounded-full border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-all"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Button
            data-testid="header-book-btn"
            asChild
            className="hidden md:inline-flex btn-gold bg-primary text-primary-foreground hover:bg-primary rounded-none px-6 h-10 tracking-widest text-xs uppercase"
          >
            <a href="#reservas">Reservar</a>
          </Button>
          <button
            data-testid="mobile-menu-toggle"
            className="lg:hidden w-10 h-10 flex items-center justify-center border border-border rounded-full"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          data-testid="mobile-menu"
          className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl"
        >
          <div className="px-6 py-6 flex flex-col gap-4">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                data-testid={`mobile-nav-${n.label.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="text-base tracking-wide py-2 border-b border-border/40"
              >
                {n.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
