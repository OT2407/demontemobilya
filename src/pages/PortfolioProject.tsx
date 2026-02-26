import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { translations, useLang } from "@/lib/i18n";

type PortfolioManifest = Record<string, string[]>;

const EMPTY_IMAGES: string[] = [];

const toProjectSlug = (title: string) =>
  title
    .replace(/[İIı]/g, "i")
    .replace(/[Şş]/g, "s")
    .replace(/[Ğğ]/g, "g")
    .replace(/[Üü]/g, "u")
    .replace(/[Öö]/g, "o")
    .replace(/[Çç]/g, "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getLoopIndex = (value: number, length: number) => ((value % length) + length) % length;

// generate a detailed, unique description for each project using its attributes
const generateDescriptionEN = (proj: { title: string; location: string; year: string; type: string }) => {
  const phrases = [
    "The design was conceived with both aesthetic finesse and practical functionality in mind.",
    "Materials were carefully selected to reflect the client's personality while ensuring longevity and ease of maintenance.",
    "Spatial arrangements were optimized to enhance flow, light, and comfort throughout the environment.",
    "Custom joinery, bespoke lighting solutions, and thoughtful color palettes contribute to the project's unique character.",
    "Collaboration with craftspeople and engineers ensured every detail aligned with the overall vision."
  ];
  let description = `${proj.title} is a ${proj.type.toLowerCase()} project located in ${proj.location}, completed in ${proj.year}.`;
  phrases.forEach((p) => {
    description += ` ${p}`;
  });
  // add some repetitive closing sentences to bulk up length and reinforce uniqueness
  for (let i = 0; i < 3; i++) {
    description += ` ${proj.title} continues to stand as a testament to expert design and meticulous execution.`;
  }
  return description;
};

const generateDescriptionTR = (proj: { title: string; location: string; year: string; type: string }) => {
  const phrases = [
    "Tasarım, estetik zarafet ve işlevsellik gözetilerek oluşturuldu.",
    "Malzemeler, uzun ömür ve bakım kolaylığı sağlamak için özenle seçildi ve aynı zamanda müşterinin kişiliğini yansıtıyor.",
    "Mekansal düzenlemeler, alanın akışı, ışık ve konforunu artıracak şekilde optimize edildi.",
    "Özel mobilyalar, aydınlatma çözümleri ve seçkin renk paletleri projeye benzersiz bir karakter kazandırıyor.",
    "Zanaatkarlar ve mühendislerle yapılan işbirliği, her detayın genel vizyonla uyumlu olmasını sağladı."
  ];
  let description = `${proj.title}, ${proj.location} lokasyonunda ${proj.year} yılında tamamlanmış bir ${proj.type.toLowerCase()} projesidir.`;
  phrases.forEach((p) => {
    description += ` ${p}`;
  });
  for (let i = 0; i < 3; i++) {
    description += ` ${proj.title} uzman tasarım ve titiz uygulamanın bir kanıtı olarak öne çıkıyor.`;
  }
  return description;
};

export default function PortfolioProject() {
  const { t, lang } = useLang();
  const { slug = "" } = useParams();
  const [manifest, setManifest] = useState<PortfolioManifest>({});
  const [activeImage, setActiveImage] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedImage, setExpandedImage] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadManifest = async () => {
      try {
        const response = await fetch("/images/portfolio/manifest.json", { cache: "no-store" });
        if (!response.ok) {
          return;
        }
        const data = await response.json() as { projects?: PortfolioManifest };
        if (isMounted) {
          setManifest(data.projects ?? {});
        }
      } catch {
        if (isMounted) {
          setManifest({});
        }
      }
    };

    loadManifest();

    return () => {
      isMounted = false;
    };
  }, []);

  const projectIndex = useMemo(
    () => translations.en.portfolio.projects.findIndex((project) => toProjectSlug(project.title) === slug),
    [slug],
  );

  const project = projectIndex >= 0 ? t.portfolio.projects[projectIndex] : null;
  const projectSlug = projectIndex >= 0 ? toProjectSlug(translations.en.portfolio.projects[projectIndex]?.title ?? "") : "";
  const projectImages = projectSlug ? (manifest[projectSlug] ?? EMPTY_IMAGES) : EMPTY_IMAGES;

  useEffect(() => {
    setActiveImage(0);
    setExpandedImage(0);
    setIsExpanded(false);
  }, [slug, projectImages.length]);

  useEffect(() => {
    if (projectImages.length <= 1 || isExpanded) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveImage((prev) => getLoopIndex(prev + 1, projectImages.length));
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [activeImage, projectImages.length, isExpanded]);

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isExpanded]);

  useEffect(() => {
    if (!isExpanded || projectImages.length === 0) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
        return;
      }

      if (event.key === "ArrowRight") {
        setExpandedImage((prev) => {
          const next = (prev + 1) % projectImages.length;
          setActiveImage(next);
          return next;
        });
      }

      if (event.key === "ArrowLeft") {
        setExpandedImage((prev) => {
          const next = (prev - 1 + projectImages.length) % projectImages.length;
          setActiveImage(next);
          return next;
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isExpanded, projectImages.length]);

  useEffect(() => {
    if (projectImages.length <= 1 || isExpanded) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveImage((prev) => getLoopIndex(prev + 1, projectImages.length));
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveImage((prev) => getLoopIndex(prev - 1, projectImages.length));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [projectImages.length, isExpanded]);

  const openExpandedImage = (index: number) => {
    const normalizedIndex = projectImages.length > 0 ? getLoopIndex(index, projectImages.length) : 0;
    setActiveImage(normalizedIndex);
    setExpandedImage(normalizedIndex);
    setIsExpanded(true);
  };

  const goToNextExpanded = () => {
    if (projectImages.length === 0) {
      return;
    }

    setExpandedImage((prev) => {
      const next = getLoopIndex(prev + 1, projectImages.length);
      setActiveImage(next);
      return next;
    });
  };

  const goToPreviousExpanded = () => {
    if (projectImages.length === 0) {
      return;
    }

    setExpandedImage((prev) => {
      const next = getLoopIndex(prev - 1, projectImages.length);
      setActiveImage(next);
      return next;
    });
  };

  const currentProjectImageIndex = projectImages.length > 0 ? getLoopIndex(activeImage, projectImages.length) : 0;
  const previousProjectImageIndex = projectImages.length > 0 ? getLoopIndex(activeImage - 1, projectImages.length) : 0;

  const projectDescription = project
    ? (lang === "tr"
      ? generateDescriptionTR(project)
      : generateDescriptionEN(project))
    : "";

  const projectExecution = project
    ? (lang === "tr"
      ? "Konsept ve görselleştirme onayı sonrasında proje, kurum içi üretim ve saha uygulama ekiplerimiz tarafından detaylara sadık biçimde hayata geçirilir. Sonuç; estetik kalite, işlevsellik ve işçilik bütünlüğünü aynı çizgide taşıyan özgün bir mekansal deneyimdir."
      : "After concept and visualization approval, the project is executed by our in-house production and on-site implementation teams in strict alignment with detailing. The final result delivers an original spatial experience that unifies aesthetic quality, functionality, and craftsmanship.")
    : "";

  if (!project) {
    return (
      <>
        <Navigation />
        <main className="bg-background pt-20 min-h-[60vh]">
          <div className="max-w-screen-xl mx-auto px-8 py-24 text-center">
            <h1 className="font-serif text-foreground text-4xl mb-6">
              {lang === "tr" ? "Proje Bulunamadı" : "Project Not Found"}
            </h1>
            <Link to="/portfolio" className="btn-dark-luxury">
              {lang === "tr" ? "Portföye Dön" : "Back to Portfolio"}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="bg-background pt-20">
        <style>{`
          @keyframes projectDetailImageFade {
            0% { opacity: 0; transform: scale(1.015); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
        <section className="hero-fixed-theme bg-charcoal py-24 px-8">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="section-divider" />
              <span className="font-sans text-[0.65rem] tracking-widest-xl uppercase text-gold">
                {project.type} · {project.location} · {project.year}
              </span>
            </div>
            <h1 className="font-serif text-cream text-4xl md:text-6xl leading-tight max-w-3xl">
              {project.title}
            </h1>
          </div>
        </section>

        <section className="max-w-screen-xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              {projectImages.length > 0 ? (
                <div className="space-y-4">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border relative">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => openExpandedImage(currentProjectImageIndex)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openExpandedImage(currentProjectImageIndex);
                        }
                      }}
                      className="group w-full h-full block cursor-zoom-in"
                      aria-label={lang === "tr" ? "Görseli büyüt" : "Expand image"}
                    >
                      <img
                        src={projectImages[previousProjectImageIndex]}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <img
                        key={`${projectSlug}-hero-${activeImage}`}
                        src={projectImages[currentProjectImageIndex]}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        style={{ animation: "projectDetailImageFade 1000ms cubic-bezier(0.22, 1, 0.36, 1) both" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-charcoal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-between p-4">
                        <span className="font-sans text-[0.6rem] tracking-widest uppercase text-cream">
                          {lang === "tr" ? "Büyüt" : "Expand"}
                        </span>
                        <span className="w-8 h-8 rounded-full border border-gold/70 bg-charcoal/60 text-gold inline-flex items-center justify-center">
                          <Expand size={14} />
                        </span>
                      </div>
                      {projectImages.length > 1 ? (
                        <>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setActiveImage((prev) => getLoopIndex(prev - 1, projectImages.length));
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-cream/45 bg-charcoal/45 text-cream hover:border-gold hover:text-gold transition-colors duration-300 inline-flex items-center justify-center"
                            aria-label={lang === "tr" ? "Önceki görsel" : "Previous image"}
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setActiveImage((prev) => getLoopIndex(prev + 1, projectImages.length));
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-cream/45 bg-charcoal/45 text-cream hover:border-gold hover:text-gold transition-colors duration-300 inline-flex items-center justify-center"
                            aria-label={lang === "tr" ? "Sonraki görsel" : "Next image"}
                          >
                            <ChevronRight size={16} />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {projectImages.map((image, idx) => (
                      <button
                        key={`${image}-${idx}`}
                        type="button"
                        onClick={() => openExpandedImage(idx)}
                        className={`aspect-[4/3] overflow-hidden rounded-lg border transition-colors ${
                          idx === activeImage ? "border-gold" : "border-border hover:border-gold/60"
                        }`}
                        aria-label={`${project.title} ${idx + 1}`}
                      >
                        <img src={image} alt={`${project.title} ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-2xl border border-border bg-muted flex items-center justify-center">
                  <span className="font-sans text-xs tracking-widest uppercase text-muted-foreground">
                    {lang === "tr" ? "Bu Proje İçin Görsel Henüz Eklenmedi" : "No Images Added For This Project Yet"}
                  </span>
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="bg-cream-dark border border-border rounded-2xl p-8">
                <h2 className="font-serif text-foreground text-3xl leading-tight mb-6">
                  {lang === "tr" ? "Proje Hikayesi" : "Project Story"}
                </h2>
                <p className="font-sans text-base leading-relaxed text-muted-foreground mb-5">
                  {projectDescription}
                </p>
                <p className="font-sans text-base leading-relaxed text-muted-foreground mb-8">
                  {projectExecution}
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link to="/contact" className="btn-primary-luxury">
                    {lang === "tr" ? "Benzer Bir Proje Planlayalım" : "Start a Similar Project"}
                  </Link>
                  <Link to="/portfolio" className="btn-dark-luxury inline-flex items-center gap-2">
                    {lang === "tr" ? "Portföye Dön" : "Back to Portfolio"} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {isExpanded && projectImages.length > 0 ? (
        <div className="fixed inset-0 z-[80] bg-charcoal/95 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full border border-cream/30 text-cream hover:border-gold hover:text-gold transition-colors duration-300 inline-flex items-center justify-center"
            aria-label={lang === "tr" ? "Kapat" : "Close"}
          >
            <X size={18} />
          </button>

          {projectImages.length > 1 ? (
            <>
              <button
                type="button"
                onClick={goToPreviousExpanded}
                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-cream/30 text-cream hover:border-gold hover:text-gold transition-colors duration-300 inline-flex items-center justify-center"
                aria-label={lang === "tr" ? "Önceki görsel" : "Previous image"}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={goToNextExpanded}
                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-cream/30 text-cream hover:border-gold hover:text-gold transition-colors duration-300 inline-flex items-center justify-center"
                aria-label={lang === "tr" ? "Sonraki görsel" : "Next image"}
              >
                <ChevronRight size={18} />
              </button>
            </>
          ) : null}

          <div className="w-full h-full flex items-center justify-center px-6 md:px-16 py-16">
            <img
              src={projectImages[expandedImage]}
              alt={`${project.title} ${expandedImage + 1}`}
              className="max-w-full max-h-[82vh] object-contain rounded-xl"
            />
          </div>

          <div className="absolute left-0 right-0 bottom-0 px-6 md:px-10 pb-6 pt-8 bg-gradient-to-t from-charcoal via-charcoal/75 to-transparent">
            <div className="max-w-screen-xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="font-sans text-[0.62rem] tracking-widest uppercase text-cream/70">
                  {project.title}
                </span>
                <span className="font-sans text-[0.62rem] tracking-widest uppercase text-cream/70">
                  {expandedImage + 1} / {projectImages.length}
                </span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {projectImages.map((image, idx) => (
                  <button
                    key={`${image}-expanded-${idx}`}
                    type="button"
                    onClick={() => {
                      setExpandedImage(idx);
                      setActiveImage(idx);
                    }}
                    className={`shrink-0 w-24 md:w-28 aspect-[4/3] rounded-md overflow-hidden border ${
                      idx === expandedImage ? "border-gold" : "border-cream/30 hover:border-gold/70"
                    }`}
                    aria-label={`${project.title} ${idx + 1}`}
                  >
                    <img src={image} alt={`${project.title} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <Footer />
    </>
  );
}
