import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLang } from "@/lib/i18n";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [projectRef, setProjectRef] = useState("");
  const mapsUrl = "https://maps.google.com/?q=35.212135,33.356079";
  const mapsEmbedUrl = "https://maps.google.com/maps?q=35.212135,33.356079&z=17&output=embed";
  const { t, lang } = useLang();
  const location = useLocation();
  const c = t.contact;

  // capture project query parameter for gallery integration
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const project = (params.get("project") ?? "").trim().slice(0, 180);
    setProjectRef(project);
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const projectType = String(formData.get("projectType") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setSubmitError(
        lang === "tr"
          ? "Lütfen isim, e-posta ve mesaj alanlarını doldurun."
          : "Please fill in name, email and message."
      );
      return;
    }

    // simple email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setSubmitError(lang === "tr" ? "Geçerli bir e-posta giriniz." : "Please enter a valid email.");
      return;
    }

    setSubmitError("");
    setLoading(true);

    try {
      const resp = await fetch("https://formspree.io/f/xjgejqag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, projectType, message, projectRef }),
      });

      if (!resp.ok) {
        throw new Error("Form submission failed");
      }

      setSent(true);
      form.reset();
    } catch {
      setSubmitError(lang === "tr" ? "Gönderim başarısız oldu." : "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <main className="bg-background pt-20">
        <div className="hero-fixed-theme bg-charcoal py-28 px-8">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="section-divider" />
              <span className="font-sans text-[0.65rem] tracking-widest-xl uppercase text-gold">{c.eyebrow}</span>
            </div>
            <h1 className="font-serif text-cream text-5xl md:text-6xl leading-tight max-w-2xl">
              {c.headline}
            </h1>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-8 py-24 grid grid-cols-1 lg:grid-cols-5 gap-20">
          {/* Contact info + Map */}
          <div className="lg:col-span-2">
            <a
              id="whatsapp-consultation"
              href="https://wa.me/905488354770?text=Hello%20Demonte%20Concept,%20I%20would%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-luxury w-full flex items-center justify-center gap-3 mb-12"
            >
              <MessageCircle size={16} />
              {c.whatsapp}
            </a>

            <div className="space-y-8">
              <div className="flex gap-4">
                <MapPin size={16} className="text-gold mt-1 shrink-0" />
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-muted-foreground mb-2">{c.location}</p>
                  <p className="font-sans text-sm text-foreground leading-relaxed">
                    Ktezo Sanayi Sitesi No 22<br />Lefkoşa, Cyprus
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone size={16} className="text-gold mt-1 shrink-0" />
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-muted-foreground mb-2">{c.telephone}</p>
                  <a href="tel:+905488354770" className="font-sans text-sm text-foreground hover:text-gold transition-colors">
                    +90 548 835 47 70
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail size={16} className="text-gold mt-1 shrink-0" />
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-muted-foreground mb-2">{c.email}</p>
                  <a href="mailto:iletisim@demonteconcept.com" className="font-sans text-sm text-foreground hover:text-gold transition-colors break-all">
                    iletisim@demonteconcept.com
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock size={16} className="text-gold mt-1 shrink-0" />
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-muted-foreground mb-2">{c.hours}</p>
                  <p className="font-sans text-sm text-foreground">{c.hoursValue}</p>
                  <p className="font-sans text-sm text-muted-foreground">{c.hoursTime}</p>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="mt-12">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[0.62rem] tracking-widest uppercase text-gold hover:text-foreground transition-colors duration-300 inline-flex mb-3"
              >
                {lang === "tr" ? "Google Maps'te Aç" : "Open in Google Maps"}
              </a>
              <iframe
                title="Demonte Concept Location"
                src={mapsEmbedUrl}
                width="100%"
                height="240"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-3" id="appointment-form">
            {sent ? (
              <div className="flex flex-col items-start justify-center h-full py-12">
                <div className="section-divider mb-6" />
                <h3 className="font-serif text-3xl text-foreground mb-4">{lang === "tr" ? "Gönderildi" : "Message sent"}</h3>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  {lang === "tr"
                    ? "Talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz."
                    : "Your request has been received. We'll be in touch shortly."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="font-serif text-2xl text-foreground mb-10">
                  {lang === "tr" ? "İletişim Formu" : "Contact Form"}
                </h2>

                <div>
                  <label className="block font-sans text-xs tracking-widest uppercase text-muted-foreground mb-3">
                    {lang === "tr" ? "İsim" : "Name"} *
                  </label>
                  <input
                    name="name"
                    required
                    type="text"
                    className="w-full bg-card border border-border px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs tracking-widest uppercase text-muted-foreground mb-3">
                    {lang === "tr" ? "E-posta" : "Email"} *
                  </label>
                  <input
                    name="email"
                    required
                    type="email"
                    className="w-full bg-card border border-border px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-gold transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs tracking-widest uppercase text-muted-foreground mb-3">
                    {lang === "tr" ? "Telefon" : "Phone"}
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full bg-card border border-border px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs tracking-widest uppercase text-muted-foreground mb-3">
                    {lang === "tr" ? "Proje Türü" : "Project Type"}
                  </label>
                  <input
                    name="projectType"
                    type="text"
                    placeholder={lang === "tr" ? "ör. Konut" : "e.g. Residential"}
                    className="w-full bg-card border border-border px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs tracking-widest uppercase text-muted-foreground mb-3">
                    {lang === "tr" ? "Mesaj" : "Message"} *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="w-full bg-card border border-border px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-gold transition-colors resize-none"
                  />
                </div>

                <input type="hidden" name="projectRef" id="projectRef" value={projectRef} />

                {submitError && (
                  <p className="font-sans text-sm text-destructive">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-dark-luxury disabled:opacity-50"
                >
                  {loading
                    ? lang === "tr" ? "Gönderiliyor..." : "Sending..."
                    : lang === "tr" ? "Gönder" : "Send"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
