import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en" | "tr";

const projectList = {
  en: [
    { category: "Residential", title: "Erkan İpek Residence", type: "Residential", location: "Lefkoşa", year: "2024" },
    { category: "Residential", title: "Fatih Arı Apartment", type: "Residential", location: "Lefkoşa", year: "2024" },
    { category: "Residential", title: "Sultan Erenköylü Residence", type: "Residential", location: "Girne", year: "2024" },
    { category: "Commercial", title: "Gem Tour Headquarters", type: "Commercial", location: "Lefkoşa", year: "2023" },
    { category: "Commercial", title: "Lansman Computer Office", type: "Commercial", location: "Lefkoşa", year: "2023" },
    { category: "Residential", title: "Nafile Hanım Residence", type: "Residential", location: "Girne", year: "2023" },
    { category: "Residential", title: "Osman Yorucu Residence", type: "Residential", location: "Lefkoşa", year: "2022" },
    { category: "Commercial", title: "Rasen Construction Office", type: "Commercial", location: "Lefkoşa", year: "2022" },
    { category: "Residential", title: "Barış Gökhan Residence", type: "Residential", location: "Gazimağusa", year: "2022" },
    { category: "Hospitality", title: "Con Kahve Café", type: "Hospitality", location: "Lefkoşa", year: "2024" },
    { category: "Residential", title: "OTİS Villas", type: "Residential", location: "Girne", year: "2024" },
    { category: "Residential", title: "AHMET ERASLAN", type: "Residential", location: "Lefkoşa", year: "2024" },
    { category: "Commercial", title: "GÜZELLİK SALONU", type: "Commercial", location: "Lefkoşa", year: "2024" },
    { category: "Residential", title: "BANU HANIM", type: "Residential", location: "Lefkoşa", year: "2024" },
    { category: "Residential", title: "FATOŞ HANIM MUTFAK PROJESİ", type: "Residential", location: "Lefkoşa", year: "2024" },
    { category: "Residential", title: "GÜLSEREN HANIM", type: "Residential", location: "Lefkoşa", year: "2024" },
    { category: "Residential", title: "HAMİT BEY", type: "Residential", location: "Lefkoşa", year: "2024" },
    { category: "Residential", title: "HANDE SABANCI", type: "Residential", location: "Lefkoşa", year: "2024" },
    { category: "Residential", title: "MEHMET KATİP", type: "Residential", location: "Lefkoşa", year: "2024" },
    { category: "Residential", title: "MELİKE HANIM ÇAMAŞIR DOLABI", type: "Residential", location: "Lefkoşa", year: "2024" },
    { category: "Residential", title: "MEHMET BARANİ", type: "Residential", location: "Lefkoşa", year: "2024" },
    { category: "Residential", title: "MURAT BAŞTÜRK", type: "Residential", location: "Lefkoşa", year: "2024" },
    { category: "Residential", title: "ÖMER TOPALOĞLU", type: "Residential", location: "Lefkoşa", year: "2024" },
    { category: "Residential", title: "IH HOME", type: "Residential", location: "Lefkoşa", year: "2024" },
    { category: "Residential", title: "Haluk Yildirim", type: "Residential", location: "Lefkoşa", year: "2024" },
    { category: "Residential", title: "S.U Home", type: "Residential", location: "Lefkoşa", year: "2024" },
  ],
  tr: [
    { category: "Konut", title: "Erkan İpek Rezidans", type: "Konut", location: "Lefkoşa", year: "2024" },
    { category: "Konut", title: "Fatih Arı Apartmanı", type: "Konut", location: "Lefkoşa", year: "2024" },
    { category: "Konut", title: "Sultan Erenköylü Rezidans", type: "Konut", location: "Girne", year: "2024" },
    { category: "Ticari", title: "Gem Tour Genel Merkez", type: "Ticari", location: "Lefkoşa", year: "2023" },
    { category: "Ticari", title: "Lansman Computer Ofis", type: "Ticari", location: "Lefkoşa", year: "2023" },
    { category: "Konut", title: "Nafile Hanım Rezidans", type: "Konut", location: "Girne", year: "2023" },
    { category: "Konut", title: "Osman Yorucu Rezidans", type: "Konut", location: "Lefkoşa", year: "2022" },
    { category: "Ticari", title: "Rasen İnşaat Ofis", type: "Ticari", location: "Lefkoşa", year: "2022" },
    { category: "Konut", title: "Barış Gökhan Rezidans", type: "Konut", location: "Gazimağusa", year: "2022" },
    { category: "Otelcilik", title: "Con Kahve Kafe", type: "Otelcilik", location: "Lefkoşa", year: "2024" },
    { category: "Konut", title: "OTİS Villalar", type: "Konut", location: "Girne", year: "2024" },
    { category: "Konut", title: "AHMET ERASLAN", type: "Konut", location: "Lefkoşa", year: "2024" },
    { category: "Ticari", title: "GÜZELLİK SALONU", type: "Ticari", location: "Lefkoşa", year: "2024" },
    { category: "Konut", title: "BANU HANIM", type: "Konut", location: "Lefkoşa", year: "2024" },
    { category: "Konut", title: "FATOŞ HANIM MUTFAK PROJESİ", type: "Konut", location: "Lefkoşa", year: "2024" },
    { category: "Konut", title: "GÜLSEREN HANIM", type: "Konut", location: "Lefkoşa", year: "2024" },
    { category: "Konut", title: "HAMİT BEY", type: "Konut", location: "Lefkoşa", year: "2024" },
    { category: "Konut", title: "HANDE SABANCI", type: "Konut", location: "Lefkoşa", year: "2024" },
    { category: "Konut", title: "MEHMET KATİP", type: "Konut", location: "Lefkoşa", year: "2024" },
    { category: "Konut", title: "MELİKE HANIM ÇAMAŞIR DOLABI", type: "Konut", location: "Lefkoşa", year: "2024" },
    { category: "Konut", title: "MEHMET BARANİ", type: "Konut", location: "Lefkoşa", year: "2024" },
    { category: "Konut", title: "MURAT BAŞTÜRK", type: "Konut", location: "Lefkoşa", year: "2024" },
    { category: "Konut", title: "ÖMER TOPALOĞLU", type: "Konut", location: "Lefkoşa", year: "2024" },
    { category: "Konut", title: "İ.H HOME", type: "Konut", location: "Lefkoşa", year: "2024" },
    { category: "Konut", title: "Haluk Yildirim", type: "Konut", location: "Lefkoşa", year: "2024" },
    { category: "Konut", title: "S.U Home", type: "Konut", location: "Lefkoşa", year: "2024" },
  ],
};

export const translations = {
  en: {
    nav: {
      portfolio: "Portfolio",
      gallery: "Gallery",
      contact: "Contact",
      home: "Home",
    },
    index: {
      headline: "Innovative Designs of Your Dreams",
      subline: "Bespoke · High Quality · Luxurious",
      cta1: "View Portfolio",
      cta2: "Contact",
      portfolioEyebrow: "Selected Works",
      portfolioHeadline: "Portfolio",
      viewAll: "View All Projects",
      studioStatement: "Demonte Concept is a premium interior architecture studio delivering residential, commercial, and hospitality environments for developers and private clients.",
      ctaHeadline: "Let's work together",
      ctaBody: "Get in touch to discuss your next project.",
      ctaBtn: "Contact",
      categories: {
        Residential: "Residential",
        Hospitality: "Hospitality",
        Commercial: "Commercial",
      },
      projects: projectList.en.slice(0, 3),
    },
    portfolio: {
      eyebrow: "Selected Works",
      headline: "Portfolio",
      categories: ["All", "Residential", "Commercial", "Hospitality"],
      interested: "Interested in working together?",
      cta: "Get in Touch",
      projects: projectList.en,
    },
    contact: {
      eyebrow: "Get in Touch",
      headline: "Contact",
      location: "Location",
      telephone: "Telephone",
      email: "Email",
      hours: "Hours",
      hoursValue: "Monday – Saturday",
      hoursTime: "09:00 – 18:00",
      whatsapp: "WhatsApp",
      sendHeadline: "Send an Inquiry",
      name: "Full Name",
      company: "Company",
      companyPlaceholder: "Optional",
      emailLabel: "Email",
      phone: "Phone",
      phonePlaceholder: "+90 5XX XXX XX XX",
      projectType: "Project Type",
      projectTypes: ["Residential", "Commercial", "Hospitality", "Mixed-Use"],
      selectType: "Select type",
      message: "Message",
      messagePlaceholder: "Tell us about your project...",
      sending: "Sending...",
      send: "Send Inquiry",
      receivedHeadline: "Inquiry Received",
      receivedBody: "Thank you for reaching out. We'll be in touch within 48 hours.",
    },
    footer: {
      description: "Interior Architecture Studio delivering bespoke residential, commercial, and hospitality environments in Cyprus.",
      nav: [
        { label: "Home", path: "/" },
        { label: "Portfolio", path: "/portfolio" },
        { label: "Gallery", path: "/gallery" },
        { label: "Contact", path: "/contact" },
      ],
      contactLabel: "Contact",
      hours: "Mon–Sat · 09:00–18:00",
      allRights: "All rights reserved.",
      terms: "Terms",
      privacy: "Privacy",
    },
  },
  tr: {
    nav: {
      portfolio: "Portföy",
      gallery: "Galeri",
      contact: "İletişim",
      home: "Ana Sayfa",
    },
    index: {
      headline: "HAYALİNİZDEKİ YENİLİKÇİ TASARIMLAR",
      subline: "Özel Tasarım · Yüksek Kalite · Lüks",
      cta1: "Portföyü İncele",
      cta2: "İletişim",
      portfolioEyebrow: "Seçili Çalışmalar",
      portfolioHeadline: "Portföy",
      viewAll: "Tüm Projeleri Gör",
      studioStatement: "Demonte Concept, geliştiriciler ve özel müşteriler için konut, ticari ve otelcilik ortamları sunan üst düzey bir iç mimarlık stüdyosudur.",
      ctaHeadline: "Birlikte çalışalım",
      ctaBody: "Bir sonraki projenizi görüşmek için bizimle iletişime geçin.",
      ctaBtn: "İletişim",
      categories: {
        Residential: "Konut",
        Hospitality: "Otelcilik",
        Commercial: "Ticari",
      },
      projects: projectList.tr.slice(0, 3),
    },
    portfolio: {
      eyebrow: "Seçili Çalışmalar",
      headline: "Portföy",
      categories: ["Tümü", "Konut", "Ticari", "Otelcilik"],
      interested: "Birlikte çalışmak ister misiniz?",
      cta: "İletişime Geçin",
      projects: projectList.tr,
    },
    contact: {
      eyebrow: "İletişime Geçin",
      headline: "İletişim",
      location: "Konum",
      telephone: "Telefon",
      email: "E-posta",
      hours: "Saatler",
      hoursValue: "Pazartesi – Cumartesi",
      hoursTime: "09:00 – 18:00",
      whatsapp: "WhatsApp",
      sendHeadline: "Talep Gönderin",
      name: "Ad Soyad",
      company: "Şirket",
      companyPlaceholder: "İsteğe bağlı",
      emailLabel: "E-posta",
      phone: "Telefon",
      phonePlaceholder: "+90 5XX XXX XX XX",
      projectType: "Proje Türü",
      projectTypes: ["Konut", "Ticari", "Otelcilik", "Karma Kullanım"],
      selectType: "Tür seçin",
      message: "Mesaj",
      messagePlaceholder: "Projeniz hakkında bize bilgi verin...",
      sending: "Gönderiliyor...",
      send: "Talep Gönder",
      receivedHeadline: "Talep Alındı",
      receivedBody: "Bize ulaştığınız için teşekkürler. 48 saat içinde sizinle iletişime geçeceğiz.",
    },
    footer: {
      description: "Kıbrıs'ta özgün konut, ticari ve otelcilik ortamları sunan İç Mimarlık Stüdyosu.",
      nav: [
        { label: "Ana Sayfa", path: "/" },
        { label: "Portföy", path: "/portfolio" },
        { label: "Galeri", path: "/gallery" },
        { label: "İletişim", path: "/contact" },
      ],
      contactLabel: "İletişim",
      hours: "Pzt–Cmt · 09:00–18:00",
      allRights: "Tüm hakları saklıdır.",
      terms: "Şartlar",
      privacy: "Gizlilik",
    },
  },
};

type Translations = typeof translations.en;

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang] as Translations;
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
