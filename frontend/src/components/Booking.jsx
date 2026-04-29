import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const STEPS = ["Servicio", "Estilista", "Fecha & Hora", "Confirmación"];

export default function Booking({ services, stylists }) {
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState(null);
  const [stylistId, setStylistId] = useState(null);
  const [date, setDate] = useState(undefined);
  const [time, setTime] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [done, setDone] = useState(null);

  const service = services.find((s) => s.id === serviceId);
  const stylist = stylists.find((s) => s.id === stylistId);
  const dateStr = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    : null;

  useEffect(() => {
    const fetchSlots = async () => {
      if (!stylistId || !dateStr) return;
      try {
        const { data } = await axios.get(`${API}/bookings/availability`, {
          params: { stylist_id: stylistId, date: dateStr },
        });
        setSlots(data.slots || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchSlots();
  }, [stylistId, dateStr]);

  const canNext = () => {
    if (step === 0) return !!serviceId;
    if (step === 1) return !!stylistId;
    if (step === 2) return !!dateStr && !!time;
    return true;
  };

  const submit = async () => {
    if (!form.name || !form.email || !form.phone) {
      toast.error("Completa tus datos personales");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/bookings`, {
        service_id: serviceId,
        stylist_id: stylistId,
        date: dateStr,
        time,
        ...form,
      });
      setDone(data);
      toast.success("¡Reserva confirmada!");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "No se pudo crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setServiceId(null);
    setStylistId(null);
    setDate(undefined);
    setTime(null);
    setSlots([]);
    setForm({ name: "", email: "", phone: "", notes: "" });
    setDone(null);
  };

  return (
    <section id="reservas" data-testid="booking-section" className="relative py-28 lg:py-40 px-6 lg:px-10 bg-secondary/40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="gold-line" />
            <span className="overline text-primary">Reserva en 3 pasos</span>
            <span className="gold-line" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter">
            Agenda tu <span className="italic text-primary">transformación</span>
          </h2>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 md:gap-6 mb-12 flex-wrap">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 md:gap-3">
              <div
                data-testid={`step-indicator-${i}`}
                className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-xs border transition-all ${
                  i <= step
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`hidden md:inline text-xs uppercase tracking-widest ${i === step ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
              {i < STEPS.length - 1 && <div className={`w-6 md:w-14 h-px ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {done ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="booking-confirmation"
            className="bg-background border border-primary p-10 md:p-14 text-center max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary flex items-center justify-center mx-auto mb-6">
              <Check className="text-primary" size={28} />
            </div>
            <h3 className="text-3xl md:text-4xl mb-4">¡Reserva confirmada!</h3>
            <p className="text-muted-foreground mb-6">Recibirás un correo de confirmación en breve.</p>
            <div className="grid grid-cols-2 gap-4 text-sm text-left bg-secondary/60 p-6 mb-8">
              <div><span className="overline text-muted-foreground">Código</span><div className="mt-1 font-mono text-primary">{done.id.slice(0, 8).toUpperCase()}</div></div>
              <div><span className="overline text-muted-foreground">Servicio</span><div className="mt-1">{service?.name}</div></div>
              <div><span className="overline text-muted-foreground">Estilista</span><div className="mt-1">{stylist?.name}</div></div>
              <div><span className="overline text-muted-foreground">Fecha & hora</span><div className="mt-1">{done.date} · {done.time}</div></div>
            </div>
            <Button data-testid="booking-reset-btn" onClick={reset} className="rounded-none btn-gold bg-primary text-primary-foreground hover:bg-primary">
              Nueva reserva
            </Button>
          </motion.div>
        ) : (
          <div className="bg-background border border-border p-6 md:p-12">
            {/* Step 0: service */}
            {step === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((s) => (
                  <button
                    key={s.id}
                    data-testid={`service-option-${s.id}`}
                    onClick={() => setServiceId(s.id)}
                    className={`text-left p-6 border transition-all ${
                      serviceId === s.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xl font-medium mb-1">{s.name}</div>
                        <p className="text-sm text-muted-foreground">{s.description}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex-shrink-0 mt-1 ${serviceId === s.id ? "bg-primary border-primary" : "border-border"}`} />
                    </div>
                    <div className="mt-6 flex items-center gap-6 text-xs uppercase tracking-widest">
                      <span className="text-muted-foreground">{s.duration} min</span>
                      <span className="text-primary">Desde {s.price}€</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 1: stylist */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stylists.map((s) => (
                  <button
                    key={s.id}
                    data-testid={`stylist-option-${s.id}`}
                    onClick={() => setStylistId(s.id)}
                    className={`text-left border transition-all overflow-hidden ${
                      stylistId === s.id ? "border-primary" : "border-border hover:border-primary/60"
                    }`}
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-secondary">
                      <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.specialty}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: date + time */}
            {step === 2 && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Label className="overline text-muted-foreground mb-3 block">Elige fecha</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => { setDate(d); setTime(null); }}
                    disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                    className="border border-border"
                    data-testid="booking-calendar"
                  />
                </div>
                <div>
                  <Label className="overline text-muted-foreground mb-3 block">Elige horario</Label>
                  {!date ? (
                    <div className="text-sm text-muted-foreground">Selecciona una fecha primero.</div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {slots.map((sl) => (
                        <button
                          key={sl.time}
                          data-testid={`time-slot-${sl.time}`}
                          disabled={!sl.available}
                          onClick={() => setTime(sl.time)}
                          className={`h-12 text-sm border transition-all ${
                            !sl.available
                              ? "border-border text-muted-foreground/40 line-through cursor-not-allowed"
                              : time === sl.time
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:border-primary"
                          }`}
                        >
                          {sl.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: confirm */}
            {step === 3 && (
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-5">
                  <div>
                    <Label className="overline" htmlFor="b-name">Nombre</Label>
                    <Input id="b-name" data-testid="booking-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 rounded-none" />
                  </div>
                  <div>
                    <Label className="overline" htmlFor="b-email">Email</Label>
                    <Input id="b-email" type="email" data-testid="booking-email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 rounded-none" />
                  </div>
                  <div>
                    <Label className="overline" htmlFor="b-phone">Teléfono</Label>
                    <Input id="b-phone" data-testid="booking-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-2 rounded-none" />
                  </div>
                  <div>
                    <Label className="overline" htmlFor="b-notes">Notas (opcional)</Label>
                    <Textarea id="b-notes" data-testid="booking-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-2 rounded-none" />
                  </div>
                </div>

                <div className="bg-secondary/60 p-6 md:p-8">
                  <h4 className="font-[Playfair_Display] text-2xl mb-6">Resumen</h4>
                  <div className="space-y-4 text-sm">
                    <Row label="Servicio" value={service?.name} />
                    <Row label="Estilista" value={stylist?.name} />
                    <Row label="Fecha" value={dateStr} />
                    <Row label="Hora" value={time} />
                    <Row label="Duración" value={`${service?.duration} min`} />
                    <div className="border-t border-border pt-4 mt-4 flex items-center justify-between">
                      <span className="overline text-muted-foreground">Total</span>
                      <span className="text-2xl text-primary font-[Playfair_Display]">{service?.price}€</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Nav */}
            <div className="mt-10 flex items-center justify-between">
              <Button
                data-testid="booking-back-btn"
                variant="ghost"
                disabled={step === 0}
                onClick={() => setStep((s) => s - 1)}
                className="rounded-none uppercase tracking-widest text-xs"
              >
                <ArrowLeft size={14} className="mr-2" /> Atrás
              </Button>

              {step < 3 ? (
                <Button
                  data-testid="booking-next-btn"
                  disabled={!canNext()}
                  onClick={() => setStep((s) => s + 1)}
                  className="rounded-none btn-gold bg-primary text-primary-foreground hover:bg-primary uppercase tracking-widest text-xs h-12 px-8"
                >
                  Continuar <ArrowRight size={14} className="ml-2" />
                </Button>
              ) : (
                <Button
                  data-testid="booking-submit-btn"
                  disabled={loading}
                  onClick={submit}
                  className="rounded-none btn-gold bg-primary text-primary-foreground hover:bg-primary uppercase tracking-widest text-xs h-12 px-8"
                >
                  {loading ? "Reservando..." : "Confirmar reserva"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4">
    <span className="overline text-muted-foreground">{label}</span>
    <span className="text-right">{value || "—"}</span>
  </div>
);
