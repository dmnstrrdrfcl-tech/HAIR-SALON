import { useEffect, useState } from "react";
import "@/App.css";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./components/ThemeProvider";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import Booking from "./components/Booking";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function Site() {
  const [data, setData] = useState({ services: [], stylists: [], gallery: [], testimonials: [] });

  useEffect(() => {
    const load = async () => {
      try {
        const [s, st, g, t] = await Promise.all([
          axios.get(`${API}/services`),
          axios.get(`${API}/stylists`),
          axios.get(`${API}/gallery`),
          axios.get(`${API}/testimonials`),
        ]);
        setData({ services: s.data, stylists: st.data, gallery: g.data, testimonials: t.data });
      } catch (e) {
        console.error("Error loading data", e);
      }
    };
    load();
  }, []);

  return (
    <div className="App">
      <Loader />
      <Header />
      <main>
        <Hero />
        <Services services={data.services} />
        <Gallery items={data.gallery} />
        <Testimonials items={data.testimonials} />
        <Booking services={data.services} stylists={data.stylists} />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <Toaster position="bottom-center" theme="dark" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Site />
    </ThemeProvider>
  );
}
