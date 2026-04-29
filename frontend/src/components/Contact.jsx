import { useState } from "react";
import axios from "axios";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Completa todos los campos");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, form);
      toast.success("Mensaje enviado. Te contactaremos pronto.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("No se pudo enviar el mensaje");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto" data-testid="contact-section" className="relative py-28 lg:py-40 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="gold-line" />
              <span className="overline text-primary">Escríbenos</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-8">
              Conversemos sobre <span className="italic text-primary">tu estilo</span>
            </h2>
            <p className="text-muted-foreground mb-10 max-w-md">
              ¿Tienes una pregunta, un evento especial o quieres una consulta
              personalizada? Estamos aquí para ayudarte.
            </p>

            <div className="space-y-5 mb-10">
              <Info icon={<MapPin size={16} />} label="Estudio" value="Calle Serrano 42, Madrid" />
              <Info icon={<Phone size={16} />} label="Teléfono" value="+34 911 23 45 67" />
              <Info icon={<Mail size={16} />} label="Email" value="hola@serendipity.com" />
            </div>

            <div className="aspect-video w-full overflow-hidden border border-border">
              <iframe
                title="map"
                data-testid="contact-map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.6!2d-3.6886!3d40.4253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDI1JzMxLjEiTiAzwrA0MScxOS4wIlc!5e0!3m2!1ses!2ses!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(0.3) contrast(1.1)" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <form onSubmit={submit} data-testid="contact-form" className="bg-secondary/40 p-8 md:p-12 border border-border space-y-6">
            <div>
              <Label className="overline" htmlFor="c-name">Nombre</Label>
              <Input id="c-name" data-testid="contact-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 rounded-none h-12" />
            </div>
            <div>
              <Label className="overline" htmlFor="c-email">Email</Label>
              <Input id="c-email" data-testid="contact-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 rounded-none h-12" />
            </div>
            <div>
              <Label className="overline" htmlFor="c-message">Mensaje</Label>
              <Textarea id="c-message" data-testid="contact-message" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-2 rounded-none" />
            </div>
            <Button
              data-testid="contact-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full rounded-none btn-gold bg-primary text-primary-foreground hover:bg-primary uppercase tracking-widest text-xs h-12"
            >
              <Send size={14} className="mr-2" />
              {loading ? "Enviando..." : "Enviar mensaje"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

const Info = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-primary flex-shrink-0">{icon}</div>
    <div>
      <div className="overline text-muted-foreground">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  </div>
);
