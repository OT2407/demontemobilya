import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";

type GalleryManifest = {
  images?: string[];
};

const getReferenceNameFromImage = (image: string) => {
  const filename = image.split("/").pop() ?? image;
  return decodeURIComponent(filename).replace(/\.[^.]+$/, "");
};

const getContactReferenceSearch = (image: string) => {
  const params = new URLSearchParams();
  params.set("reference", getReferenceNameFromImage(image));
  params.set("referenceImage", image);
  return `?${params.toString()}`;
};

export default function Gallery() {
  const { lang } = useLang();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadGallery = async () => {
      try {
        const response = await fetch("/images/gallery/manifest.json", { cache: "no-store" });
        if (!response.ok) {
          if (isMounted) {
            setImages([]);
          }
          return;
        }

        const data = await response.json() as GalleryManifest;
        if (isMounted) {
          setImages(data.images ?? []);
        }
      } catch {
        if (isMounted) {
          setImages([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadGallery();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Navigation />
      <main className="bg-background pt-20">
        <div className="hero-fixed-theme bg-charcoal py-28 px-8">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="section-divider" />
              <span className="font-sans text-[0.65rem] tracking-widest-xl uppercase text-gold">
                {lang === "tr" ? "Galeri" : "Gallery"}
              </span>
            </div>
            <h1 className="font-serif text-cream text-5xl md:text-6xl leading-tight max-w-3xl">
              {lang === "tr" ? "İlham Galerisi" : "Inspiration Gallery"}
            </h1>
          </div>
        </div>

        <section className="max-w-screen-xl mx-auto px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <p className="font-sans text-base leading-relaxed text-muted-foreground max-w-2xl">
              {lang === "tr"
                ? "Tüm görsellerimizi burada inceleyebilir, herhangi bir görseli tasarım referansı olarak seçip size özel proje görüşmesi talep edebilirsiniz."
                : "Browse all of our visuals here and use any image as a design reference to request a tailored project consultation."}
            </p>
            <span className="font-sans text-[0.62rem] tracking-widest uppercase text-muted-foreground">
              {lang === "tr" ? `${images.length} Görsel` : `${images.length} Images`}
            </span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-border bg-card py-16 text-center">
              <p className="font-sans text-sm tracking-widest uppercase text-muted-foreground">
                {lang === "tr" ? "Galeri yükleniyor" : "Loading gallery"}
              </p>
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {images.map((image, idx) => (
                <Link
                  key={`${image}-${idx}`}
                  to={{
                    pathname: "/contact",
                    search: getContactReferenceSearch(image),
                    hash: "#appointment-form",
                  }}
                  className="group block"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border relative group-hover:shadow-lg transition-shadow duration-300">
                    <img
                      src={image}
                      alt={lang === "tr" ? `Galeri Görseli ${idx + 1}` : `Gallery Image ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute left-4 right-4 bottom-4 flex items-center justify-between opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <span className="font-sans text-[0.58rem] tracking-widest uppercase text-cream">
                        {lang === "tr" ? "Randevu Oluştur" : "Book Appointment"}
                      </span>
                      <span className="w-8 h-8 rounded-full border border-gold/70 bg-charcoal/70 text-gold inline-flex items-center justify-center">
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-cream-dark py-12 px-8 text-center">
              <p className="font-sans text-sm tracking-wider uppercase text-muted-foreground mb-6">
                {lang === "tr" ? "Galeri Görselleri Hazırlanıyor" : "Gallery Visuals Are Being Prepared"}
              </p>
              <Link to="/contact#appointment-form" className="btn-dark-luxury inline-flex items-center gap-2">
                {lang === "tr" ? "Randevu Oluştur" : "Book Appointment"}
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}