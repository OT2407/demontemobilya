import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

export default function Portfolio() {
  const { t, lang } = useLang();
  const p = t.portfolio;
  const [activeCategory, setActiveCategory] = useState(0);
  const [manifest, setManifest] = useState<PortfolioManifest>({});
  const [projectImageStep, setProjectImageStep] = useState(0);

  // Category mapping for filtering: index 0 = All, rest map to EN category keys
  const categoryKeys = ["All", "Residential", "Commercial", "Hospitality"];
  const activeCategoryKey = categoryKeys[activeCategory];

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

  const allProjects = useMemo(() => (
    p.projects.map((proj, i) => {
      const enProjectTitle = translations.en.portfolio.projects[i]?.title ?? proj.title;
      const slug = toProjectSlug(enProjectTitle);
      const images = manifest[slug] ?? EMPTY_IMAGES;
      return { ...proj, slug, images };
    })
  ), [p.projects, manifest]);

  const filteredProjects = useMemo(() => (
    activeCategoryKey === "All"
      ? allProjects
      : allProjects.filter((proj) => {
          // Match against EN category key regardless of language
          const enProjects = (lang === "tr")
            ? (() => {
                const trCats = ["Konut", "Ticari", "Otelcilik"];
                const enCats = ["Residential", "Commercial", "Hospitality"];
                const idx = trCats.indexOf(proj.category);
                return idx >= 0 ? enCats[idx] : proj.category;
              })()
            : proj.category;
          return enProjects === activeCategoryKey;
        })
  ), [activeCategoryKey, allProjects, lang]);

  const hasMultiImageProjects = useMemo(
    () => filteredProjects.some((project) => project.images.length > 1),
    [filteredProjects],
  );
  const hasMultipleCategories = p.categories.length > 1;

  useEffect(() => {
    if (!hasMultiImageProjects) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setProjectImageStep((prev) => prev + 1);
    }, 5000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [projectImageStep, hasMultiImageProjects]);

  useEffect(() => {
    if (!hasMultiImageProjects) {
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
        setProjectImageStep((prev) => prev + 1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setProjectImageStep((prev) => prev - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hasMultiImageProjects]);

  return (
    <>
      <Navigation />
      <main className="bg-background pt-20">
        <style>{`
          @keyframes portfolioImageFadeIn {
            0% { opacity: 0; transform: scale(1.015); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
        <div className="hero-fixed-theme bg-charcoal py-28 px-8">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="section-divider" />
              <span className="font-sans text-[0.65rem] tracking-widest-xl uppercase text-gold">{p.eyebrow}</span>
            </div>
            <h1 className="font-serif text-cream text-5xl md:text-6xl leading-tight max-w-2xl">{p.headline}</h1>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-8 py-16">
          <div className="flex items-end justify-between gap-6 mb-12">
            <div className="flex gap-8 border-b border-border overflow-x-auto flex-1">
              {p.categories.map((cat, i) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(i)}
                  className={`font-sans text-xs tracking-widest uppercase pb-4 border-b-2 shrink-0 transition-colors duration-300 ${
                    activeCategory === i
                      ? "border-gold text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory((prev) => getLoopIndex(prev - 1, p.categories.length))}
                disabled={!hasMultipleCategories}
                className="w-10 h-10 rounded-full border border-border text-foreground/70 hover:text-gold hover:border-gold transition-colors duration-300 inline-flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label={lang === "tr" ? "Önceki kategori" : "Previous category"}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory((prev) => getLoopIndex(prev + 1, p.categories.length))}
                disabled={!hasMultipleCategories}
                className="w-10 h-10 rounded-full border border-border text-foreground/70 hover:text-gold hover:border-gold transition-colors duration-300 inline-flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label={lang === "tr" ? "Sonraki kategori" : "Next category"}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="md:hidden flex justify-end gap-2 mb-8">
            <button
              type="button"
              onClick={() => setActiveCategory((prev) => getLoopIndex(prev - 1, p.categories.length))}
              disabled={!hasMultipleCategories}
              className="w-10 h-10 rounded-full border border-border text-foreground/70 hover:text-gold hover:border-gold transition-colors duration-300 inline-flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label={lang === "tr" ? "Önceki kategori" : "Previous category"}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory((prev) => getLoopIndex(prev + 1, p.categories.length))}
              disabled={!hasMultipleCategories}
              className="w-10 h-10 rounded-full border border-border text-foreground/70 hover:text-gold hover:border-gold transition-colors duration-300 inline-flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label={lang === "tr" ? "Sonraki kategori" : "Next category"}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, i) => (
              <Link
                key={i}
                to={`/portfolio/${project.slug}`}
                className="project-card frame-lift group block w-full text-left"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  {project.images.length > 0 ? (
                    <>
                      {(() => {
                        const currentIndex = getLoopIndex(projectImageStep, project.images.length);
                        const previousIndex = getLoopIndex(projectImageStep - 1, project.images.length);
                        return (
                          <>
                            <img
                              src={project.images[previousIndex]}
                              alt=""
                              aria-hidden="true"
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <img
                              key={`${project.slug}-${projectImageStep}`}
                              src={project.images[currentIndex]}
                              alt={project.title}
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover"
                              style={{ animation: "portfolioImageFadeIn 1000ms cubic-bezier(0.22, 1, 0.36, 1) both" }}
                            />
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-muted flex items-center justify-center">
                      <span className="font-sans text-[0.62rem] tracking-widest uppercase text-muted-foreground/70">
                        {lang === "tr" ? "Görsel Eklenmedi" : "Images Not Added Yet"}
                      </span>
                    </div>
                  )}
                  <div className="frame-caption-layer">
                    <div className="frame-caption-content">
                      <span className="frame-caption-kicker font-sans text-[0.6rem] tracking-widest uppercase block mb-1">{project.type}</span>
                      <h3 className="frame-caption-title font-serif text-xl leading-tight">{project.title}</h3>
                      <span className="frame-caption-meta font-sans text-[0.62rem] tracking-widest uppercase mt-3 block">
                        {lang === "tr" ? "Proje Detaylarını Gör" : "View Project Details"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-border py-20 text-center">
          <p className="font-sans text-muted-foreground text-sm mb-8">{p.interested}</p>
          <Link to="/contact" className="btn-dark-luxury">{p.cta}</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
