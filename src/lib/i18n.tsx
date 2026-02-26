import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en" | "tr";

const projectList = {
  en: [
    { category: "Residential", title: "Erkan İpek Residence", type: "Residential", location: "Lefkoşa", year: "2026", description: "It offers a modern luxury experience with open-plan living spaces, premium materials, and custom millwork that creates a sophisticated atmosphere." },
    { category: "Residential", title: "Fatih Arı Apartment", type: "Residential", location: "Lefkoşa", year: "2025", description: "This space features contemporary design with sleek finishes and a functional layout that's perfectly optimized for urban living." },
    { category: "Residential", title: "Sultan Erenköylü Residence", type: "Residential", location: "Girne", year: "2025", description: "It blends Mediterranean aesthetics with modern comfort, creating a coastal retreat that maximizes sea views and natural light." },
    { category: "Commercial", title: "Gem Tour Headquarters", type: "Commercial", location: "Lefkoşa", year: "2023", description: "This professional office space is designed for collaboration, featuring ergonomic workstations and brand-focused aesthetics that enhance productivity." },
    { category: "Commercial", title: "Lansman Computer Office", type: "Commercial", location: "Lefkoşa", year: "2022", description: "It provides a tech-focused environment with modern infrastructure and innovative workspace solutions that support digital workflows." },
    { category: "Residential", title: "Nafile Hanım Residence", type: "Residential", location: "Girne", year: "2023", description: "This elegant seaside home features sophisticated interiors with meticulous attention to detail and ultimate comfort." },
    { category: "Residential", title: "Osman Yorucu Residence", type: "Residential", location: "Lefkoşa", year: "2022", description: "It combines functionality with style, featuring custom storage solutions and modern amenities that enhance daily living." },
    { category: "Commercial", title: "Rasen Construction Office", type: "Commercial", location: "Lefkoşa", year: "2022", description: "This industrial-chic office space reflects the company's construction expertise through robust materials and clean, purposeful lines." },
    { category: "Residential", title: "Barış Gökhan Residence", type: "Residential", location: "Gazimağusa", year: "2022", description: "It offers a spacious family home where traditional elements are reinterpreted through contemporary design for modern living." },
    { category: "Hospitality", title: "Con Kahve Café", type: "Hospitality", location: "Lefkoşa", year: "2025", description: "This inviting café space is designed for social interaction, featuring warm materials and comfortable seating arrangements that encourage connection." },
    { category: "Residential", title: "OTİS Villas", type: "Residential", location: "Girne", year: "2024", description: "These luxury villas feature high-end finishes and seamless indoor-outdoor living that creates a resort-like atmosphere." },
    { category: "Residential", title: "AHMET ERASLAN", type: "Residential", location: "Lefkoşa", year: "2024", description: "This custom residence showcases personalized design elements and premium craftsmanship that reflect the client's unique vision." },
    { category: "Commercial", title: "GÜZELLİK SALONU", type: "Commercial", location: "Lefkoşa", year: "2024", description: "It's designed for relaxation and pampering, featuring elegant finishes and a functional layout that enhances the client experience." },
    { category: "Residential", title: "BANU HANIM", type: "Residential", location: "Lefkoşa", year: "2023", description: "This refined apartment features a sophisticated color palette and custom furniture pieces that create an elegant living environment." },
    { category: "Residential", title: "FATOŞ HANIM MUTFAK PROJESİ", type: "Residential", location: "Lefkoşa", year: "2023", description: "This gourmet kitchen is designed for both functionality and aesthetics, featuring premium appliances and custom cabinetry that elevate the cooking experience." },
    { category: "Residential", title: "GÜLSEREN HANIM", type: "Residential", location: "Lefkoşa", year: "2024", description: "It offers an elegant living space with meticulous attention to detail and harmonious material selection that creates a cohesive atmosphere." },
    { category: "Residential", title: "HAMİT BEY", type: "Residential", location: "Lefkoşa", year: "2024", description: "This modern residence features clean lines and functional design elements that create a minimalist yet comfortable living space." },
    { category: "Residential", title: "HANDE SABANCI", type: "Residential", location: "Lefkoşa", year: "2023", description: "It features a contemporary design with smart storage solutions and modern amenities that optimize space and functionality." },
    { category: "Residential", title: "MEHMET KATİP", type: "Residential", location: "Lefkoşa", year: "2024", description: "This custom-designed residence reflects the client's lifestyle and preferences through personalized design choices and thoughtful planning." },
    { category: "Residential", title: "MELİKE HANIM ÇAMAŞIR DOLABI", type: "Residential", location: "Lefkoşa", year: "2023", description: "It's a custom laundry cabinet designed for optimal functionality and seamless integration that enhances the utility of the space." },
    { category: "Residential", title: "MEHMET BARANİ", type: "Residential", location: "Lefkoşa", year: "2025", description: "This modern residence features innovative storage solutions and contemporary design that maximizes space and style." },
    { category: "Residential", title: "MURAT BAŞTÜRK", type: "Residential", location: "Lefkoşa", year: "2024", description: "It offers an elegant living space with custom millwork and premium material selection that creates a refined atmosphere." },
    { category: "Residential", title: "ÖMER TOPALOĞLU", type: "Residential", location: "Lefkoşa", year: "2025", description: "This contemporary residence features an open-plan layout and modern amenities that create a spacious and functional living environment." },
    { category: "Residential", title: "IH HOME", type: "Residential", location: "Lefkoşa", year: "2026", description: "It's a custom home designed for modern living with meticulous attention to detail and functionality that enhances daily life." },
    { category: "Residential", title: "Haluk Yildirim", type: "Residential", location: "Lefkoşa", year: "2023", description: "This refined residence features sophisticated design elements and premium finishes that create an elegant and comfortable atmosphere." },
    { category: "Residential", title: "S.U Home", type: "Residential", location: "Lefkoşa", year: "2024", description: "It offers a contemporary home with a functional layout and modern design elements that create a harmonious living space." },
  ],
  tr: [
    { category: "Konut", title: "Erkan İpek Rezidans", type: "Konut", location: "Lefkoşa", year: "2026", description: "O, açık plan yaşam alanları, premium malzemeler ve özel mobilyalarla donatılmış modern lüks bir deneyim sunar." },
    { category: "Konut", title: "Fatih Arı Apartmanı", type: "Konut", location: "Lefkoşa", year: "2025", description: "Bu, şehir yaşamına uygun optimize edilmiş fonksiyonel yerleşim planı ve şık bitiricilerle modern bir apartman tasarımı sunar." },
    { category: "Konut", title: "Sultan Erenköylü Rezidans", type: "Konut", location: "Girne", year: "2025", description: "O, deniz manzarasını ve doğal ışığı en üst seviyeye çıkaran Akdeniz estetiğiyle modern konforu birleştiren sahil rezidansı sunar." },
    { category: "Ticari", title: "Gem Tour Genel Merkez", type: "Ticari", location: "Lefkoşa", year: "2023", description: "Bu, iş birliği için tasarlanmış marka odaklı estetik ve ergonomik çalışma istasyonlu profesyonel bir ofis uzayı sunar." },
    { category: "Ticari", title: "Lansman Computer Ofis", type: "Ticari", location: "Lefkoşa", year: "2022", description: "O, modern altyapı ve inovatif iş alanı çözümleriyle donatılmış teknoloji odaklı bir ofis ortamı sunar." },
    { category: "Konut", title: "Nafile Hanım Rezidans", type: "Konut", location: "Girne", year: "2023", description: "Bu, detaylara önem verilmiş, konforu ön planda tutan zarif bir deniz kenarı evi sunar." },
    { category: "Konut", title: "Osman Yorucu Rezidans", type: "Konut", location: "Lefkoşa", year: "2022", description: "O, modern konfor ve şık tasarımı birleştiren, özel depolama çözümleri ve modern olanaklar sunan şehir içi bir rezidans sunar." },
    { category: "Ticari", title: "Rasen İnşaat Ofis", type: "Ticari", location: "Lefkoşa", year: "2022", description: "Bu, şirketin inşaat uzmanlığını yansıtan, sağlam malzemeler ve temiz hatlarla endüstriyel-chic bir ofis uzayı sunar." },
    { category: "Konut", title: "Barış Gökhan Rezidans", type: "Konut", location: "Gazimağusa", year: "2022", description: "O, geleneksel unsurların çağdaş tasarım ile yeniden yorumlandığı geniş bir aile evi sunar." },
    { category: "Otelcilik", title: "Con Kahve Kafe", type: "Otelcilik", location: "Lefkoşa", year: "2025", description: "Bu, sosyal etkileşim için tasarlanmış, sıcak malzemeler ve konforlu oturma düzeniyle davetkar bir kahve dükkanı sunar." },
    { category: "Konut", title: "OTİS Villalar", type: "Konut", location: "Girne", year: "2024", description: "Bu, yüksek kaliteli bitiriciler ve iç-mekan dış-mekan yaşamının sorunsuz bir şekilde birleştiği lüks villa geliştirme projesi sunar." },
    { category: "Konut", title: "AHMET ERASLAN", type: "Konut", location: "Lefkoşa", year: "2024", description: "Bu, kişiselleştirilmiş tasarım elemanları ve premium işçilikle ortaya çıkarılmış özel bir rezidans sunar." },
    { category: "Ticari", title: "GÜZELLİK SALONU", type: "Ticari", location: "Lefkoşa", year: "2024", description: "O, rahatlama ve bakım için tasarlanmış, zarif bitiriciler ve fonksiyonel yerleşim planı ile güzellik salonu sunar." },
    { category: "Konut", title: "BANU HANIM", type: "Konut", location: "Lefkoşa", year: "2023", description: "Bu, ince renk paleti ve özel mobilya parçalarıyla donatılmış kusursuz bir apartman sunar." },
    { category: "Konut", title: "FATOŞ HANIM MUTFAK PROJESİ", type: "Konut", location: "Lefkoşa", year: "2023", description: "Bu, premium cihazlar ve özel dolaplarla donatılmış hem fonksiyonel hem estetik bir gourmet mutfak tasarımı sunar." },
    { category: "Konut", title: "GÜLSEREN HANIM", type: "Konut", location: "Lefkoşa", year: "2024", description: "O, detaylara önem verilmiş, uyumlu malzeme seçimiyle zarif bir yaşam uzayı sunar." },
    { category: "Konut", title: "HAMİT BEY", type: "Konut", location: "Lefkoşa", year: "2024", description: "Bu, temiz hatlar ve fonksiyonel tasarım elemanlarıyla modern bir rezidans sunar." },
    { category: "Konut", title: "HANDE SABANCI", type: "Konut", location: "Lefkoşa", year: "2023", description: "O, akıllı depolama çözümleri ve modern olanaklarla donatılmış çağdaş bir apartman sunar." },
    { category: "Konut", title: "MEHMET KATİP", type: "Konut", location: "Lefkoşa", year: "2024", description: "Bu, müşterinin yaşam tarzı ve tercihlerini yansıtan özel tasarlanmış bir rezidans sunar." },
    { category: "Konut", title: "MELİKE HANIM ÇAMAŞIR DOLABI", type: "Konut", location: "Lefkoşa", year: "2023", description: "O, optimal fonksiyonellik ve sorunsuz entegrasyon için tasarlanmış özel bir çamaşır dolabı sunar." },
    { category: "Konut", title: "MEHMET BARANİ", type: "Konut", location: "Lefkoşa", year: "2025", description: "Bu, inovatif depolama çözümleri ve çağdaş tasarım ile modern bir rezidans sunar." },
    { category: "Konut", title: "MURAT BAŞTÜRK", type: "Konut", location: "Lefkoşa", year: "2024", description: "O, özel mobilyalar ve premium malzeme seçimiyle zarif bir yaşam uzayı sunar." },
    { category: "Konut", title: "ÖMER TOPALOĞLU", type: "Konut", location: "Lefkoşa", year: "2025", description: "Bu, açık plan yerleşim ve modern olanaklarla donatılmış çağdaş bir rezidans sunar." },
    { category: "Konut", title: "İ.H HOME", type: "Konut", location: "Lefkoşa", year: "2026", description: "O, modern yaşam için tasarlanmış, detaylara önem verilmiş ve fonksiyonel olan özel bir ev sunar." },
    { category: "Konut", title: "Haluk Yildirim", type: "Konut", location: "Lefkoşa", year: "2023", description: "Bu, ince tasarım elemanları ve premium bitiricilerle kusursuz bir rezidans sunar." },
    { category: "Konut", title: "S.U Home", type: "Konut", location: "Lefkoşa", year: "2024", description: "O, fonksiyonel yerleşim planı ve modern tasarım elemanlarıyla çağdaş bir ev sunar." },
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
