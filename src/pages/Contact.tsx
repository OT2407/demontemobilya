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
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [projectParam, setProjectParam] = useState("");
  const [projectImageUrl, setProjectImageUrl] = useState("");
  const mapsUrl = "https://maps.google.com/?q=35.212135,33.356079";
  const mapsEmbedUrl = "https://maps.google.com/maps?q=35.212135,33.356079&z=17&output=embed";
  const { t, lang } = useLang();
  const location = useLocation();
  const c = t.contact;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const project = (params.get("project") ?? "").trim().slice(0, 300);
    setProjectParam(project);
    if (project && /\.(jpe?g|png|webp|gif|avif)$/i.test(project)) {
      setProjectImageUrl(project);
    } else {
      setProjectImageUrl("");
    }
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

    setEmailError("");
    setPhoneError("");
    setSubmitError("");

    let valid = true;

    // Enhanced email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError(lang === "tr" ? "E-posta adresi gereklidir." : "Email address is required.");
      valid = false;
    } else if (!emailPattern.test(email)) {
      setEmailError(lang === "tr" ? "Geçerli bir e-posta adresi giriniz." : "Please enter a valid email address.");
      valid = false;
    } else if (email.length > 254) {
      setEmailError(lang === "tr" ? "E-posta adresi çok uzun." : "Email address is too long.");
      valid = false;
    }

    // Enhanced phone validation
    const phoneDigits = phone.replace(/\D/g, "");
    if (phone && phoneDigits.length < 7) {
      setPhoneError(lang === "tr" ? "Geçerli bir telefon numarası giriniz (en az 7 rakam)." : "Please enter a valid phone number (minimum 7 digits).");
      valid = false;
    } else if (phone && phoneDigits.length > 15) {
      setPhoneError(lang === "tr" ? "Telefon numarası çok uzun." : "Phone number is too long.");
      valid = false;
    }

    // Enhanced message validation
    if (message && message.length > 1000) {
      setSubmitError(lang === "tr" ? "Mesaj çok uzun. Lütfen 1000 karakterden az yazınız." : "Message is too long. Please keep it under 1000 characters.");
      valid = false;
    }

    // Enhanced project type validation
    if (projectType && projectType.length > 100) {
      setSubmitError(lang === "tr" ? "Proje tipi çok uzun." : "Project type is too long.");
      valid = false;
    }

    if (!valid) return;

    setLoading(true);

    try {
      // Use the native form submission instead of fetch
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      setSent(true);
      form.reset();
      setEmailError("");
      setPhoneError("");
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError(
        lang === "tr"
          ? "Bir hata oluştu. Lütfen tekrar deneyin veya bizi doğrudan arayın."
          : "Something went wrong. Please try again or contact us directly."
      );
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
                <h3 className="font-serif text-3xl text-foreground mb-4">
                  {lang === "tr" ? "Gönderim başarılı" : "Submission successful"}
                </h3>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  {lang === "tr"
                    ? "Bir ekip arkadaşımız 24 saat içinde sizinle iletişime geçecektir."
                    : "A member of our team will reach out within 24 hours."}
                </p>
              </div>
            ) : (
              <form action="https://formspree.io/f/xjgejqag" method="POST" onSubmit={handleSubmit} noValidate className="space-y-6">
                <h2 className="font-serif text-2xl text-foreground mb-10">
                  {lang === "tr" ? "İletişim Formu" : "Contact Form"}
                </h2>

                {/* Gallery → Contact: image preview only, no filename */}
                {projectImageUrl && (
                  <div className="mb-2">
                    <p className="font-sans text-[0.65rem] tracking-widest uppercase text-muted-foreground mb-3">
                      {lang === "tr" ? "Seçilen Görsel" : "Selected Image"}
                    </p>
                    <div className="overflow-hidden rounded-lg border border-border">
                      <img
                        src={projectImageUrl}
                        alt={lang === "tr" ? "Seçilen proje görseli" : "Selected project image"}
                        className="w-full max-h-52 object-cover"
                      />
                    </div>
                  </div>
                )}

                <input type="hidden" name="project" value={projectParam} />

                <div>
                  <label className="block font-sans text-xs tracking-widest uppercase text-muted-foreground mb-3">
                    {lang === "tr" ? "İsim" : "Name"}
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full bg-card border border-border px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-gold transition-colors"
                    placeholder={lang === "tr" ? "Adınız Soyadınız" : "Your Full Name"}
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs tracking-widest uppercase text-muted-foreground mb-3">
                    {lang === "tr" ? "E-posta" : "Email"} *
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className={`w-full bg-card border px-4 py-3 font-sans text-sm text-foreground focus:outline-none transition-colors ${
                      emailError ? "border-destructive" : "border-border focus:border-gold"
                    }`}
                    placeholder="your@email.com"
                  />
                  {emailError && (
                    <p className="font-sans text-xs text-destructive mt-2">{emailError}</p>
                  )}
                </div>

                <div>
                  <label className="block font-sans text-xs tracking-widest uppercase text-muted-foreground mb-3">
                    {lang === "tr" ? "Telefon" : "Phone"}
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    className={`w-full bg-card border px-4 py-3 font-sans text-sm text-foreground focus:outline-none transition-colors ${
                      phoneError ? "border-destructive" : "border-border focus:border-gold"
                    }`}
                    placeholder={lang === "tr" ? "+90 5XX XXX XX XX" : "+90 5XX XXX XX XX"}
                  />
                  {phoneError && (
                    <p className="font-sans text-xs text-destructive mt-2">{phoneError}</p>
                  )}
                </div>

                <div>
                  <label className="block font-sans text-xs tracking-widest uppercase text-muted-foreground mb-3">
                    {lang === "tr" ? "Proje Türü" : "Project Type"}
                  </label>
                  <input
                    name="projectType"
                    type="text"
                    className="w-full bg-card border border-border px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-gold transition-colors"
                    placeholder={lang === "tr" ? "ör. Konut, Ticari, Otelcilik" : "e.g. Residential, Commercial, Hospitality"}
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs tracking-widest uppercase text-muted-foreground mb-3">
                    {lang === "tr" ? "Mesaj" : "Message"}
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    className="w-full bg-card border border-border px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-gold transition-colors resize-none"
                    placeholder={lang === "tr" ? "Projeniz hakkında bize bilgi verin..." : "Tell us about your project..."}
                  />
                </div>

                {submitError && (
                  <p className="font-sans text-sm text-destructive">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-dark-luxury disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? (lang === "tr" ? "Gönderiliyor..." : "Sending...")
                    : (lang === "tr" ? "Gönder" : "Send")}
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