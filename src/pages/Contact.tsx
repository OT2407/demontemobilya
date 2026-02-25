import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Clock, MessageCircle, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLang } from "@/lib/i18n";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [projectType, setProjectType] = useState("");
  const [referenceProject, setReferenceProject] = useState("");
  const [referenceImage, setReferenceImage] = useState("");
  const mapsUrl = "https://maps.google.com/?q=35.212135,33.356079";
  const mapsEmbedUrl = "https://maps.google.com/maps?q=35.212135,33.356079&z=17&output=embed";
  const { t, lang } = useLang();
  const location = useLocation();
  const c = t.contact;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nextReferenceProject = (params.get("reference") ?? "").trim().slice(0, 180);
    const nextReferenceImageRaw = (params.get("referenceImage") ?? "").trim();
    const nextReferenceImage = nextReferenceImageRaw.startsWith("/images/gallery/") ? nextReferenceImageRaw : "";
    setReferenceProject(nextReferenceProject);
    setReferenceImage(nextReferenceImage);
  }, [location.search]);

  useEffect(() => {
    const hashId = decodeURIComponent(location.hash.replace("#", ""));
    if (!hashId) {
      return;
    }

    if (hashId !== "whatsapp-consultation" && hashId !== "appointment-form") {
      return;
    }

    const scrollToTarget = () => {
      const target = document.getElementById(hashId);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: hashId === "appointment-form" ? "start" : "center",
        });
      }
    };

    scrollToTarget();
    const timeout = window.setTimeout(scrollToTarget, 120);
    return () => window.clearTimeout(timeout);
  }, [location.hash]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formElement = e.currentTarget as HTMLFormElement;
    const formData = new FormData(formElement);

    const payload = {
      fullName: String(formData.get("fullName") ?? "").trim(),
      company: String(formData.get("company") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      projectType: String(formData.get("projectType") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      referenceProject,
      referenceImage,
    };

    if (!payload.fullName || !payload.email || !payload.message) {
      setSubmitError(lang === "tr"
        ? "Lütfen ad soyad, e-posta ve mesaj alanlarını doldurun."
        : "Please complete full name, email, and message fields.");
      return;
    }

    setSubmitError("");
    setLoading(true);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json() as { success?: boolean; error?: string };

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to send inquiry");
      }

      formElement.reset();
      setProjectType("");
      setSent(true);
    } catch {
      setSubmitError(lang === "tr"
        ? "Talep gönderilemedi. Lütfen daha sonra tekrar deneyin."
        : "Inquiry could not be sent. Please try again later.");
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
                <h3 className="font-serif text-3xl text-foreground mb-4">{c.receivedHeadline}</h3>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  {c.receivedBody}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="font-serif text-2xl text-foreground mb-10">{c.sendHeadline}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-muted-foreground mb-3">{c.name} *</label>
                    <input name="fullName" required type="text" className="w-full bg-card border border-border px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-gold transition-colors" placeholder={c.name} />
                  </div>
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-muted-foreground mb-3">{c.company}</label>
                    <input name="company" type="text" className="w-full bg-card border border-border px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-gold transition-colors" placeholder={c.companyPlaceholder} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-muted-foreground mb-3">{c.emailLabel} *</label>
                    <input name="email" required type="email" className="w-full bg-card border border-border px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-gold transition-colors" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-muted-foreground mb-3">{c.phone}</label>
                    <input name="phone" type="tel" className="w-full bg-card border border-border px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-gold transition-colors" placeholder={c.phonePlaceholder} />
                  </div>
                </div>
                <div>
                  <label className="block font-sans text-xs tracking-widest uppercase text-muted-foreground mb-3">{c.projectType}</label>
                  <div className="relative">
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      name="projectType"
                      className="w-full bg-card border border-border px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">{c.selectType}</option>
                      {c.projectTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block font-sans text-xs tracking-widest uppercase text-muted-foreground mb-3">{c.message} *</label>
                  <textarea name="message" required rows={5} className="w-full bg-card border border-border px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-gold transition-colors resize-none" placeholder={c.messagePlaceholder} />
                </div>
                {referenceProject ? (
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-muted-foreground mb-3">
                      {lang === "tr" ? "Seçilen Referans" : "Selected Reference"}
                    </label>
                    <div className="w-full bg-card border border-border px-4 py-3 font-sans text-sm text-foreground">
                      {referenceProject}
                    </div>
                    {referenceImage ? (
                      <div className="mt-3 w-20 aspect-[4/5] overflow-hidden rounded-lg border border-border">
                        <img
                          src={referenceImage}
                          alt={lang === "tr" ? "Seçilen referans görseli" : "Selected reference image"}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {submitError ? (
                  <p className="font-sans text-sm text-destructive">{submitError}</p>
                ) : null}
                <button type="submit" disabled={loading} className="btn-dark-luxury disabled:opacity-50">
                  {loading ? c.sending : c.send}
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
