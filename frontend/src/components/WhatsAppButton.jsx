import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const number = "34911234567";
  const text = encodeURIComponent("Hola SERENDIPITY, me gustaría consultar una reserva");
  return (
    <a
      data-testid="whatsapp-float-btn"
      href={`https://wa.me/${number}?text=${text}`}
      target="_blank"
      rel="noreferrer"
      className="wa-float"
      aria-label="WhatsApp"
    >
      <MessageCircle size={26} />
    </a>
  );
}
