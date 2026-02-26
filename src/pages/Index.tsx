import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import heroVideo from "@/assets/hero-video.mp4";
import { translations, useLang } from "@/lib/i18n";

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

const HOME_DRAG_FRICTION = 0.4;
const HOME_AUTO_SCROLL_SPEED = 22;
const HOME_GALLERY_PREVIEW_COUNT = 8;

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const shuffleImages = (images: string[]) => {
  const shuffled = [...images];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i] ?? "";
    shuffled[i] = shuffled[j] ?? "";
    shuffled[j] = temp;
  }
  return shuffled;
};

const getHomeGalleryPreviewImages = (images: string[]) => {
  const shuffled = shuffleImages(images);
  if (shuffled.length === 0) {
    return [];
  }

  const preview = shuffled.slice(0, Math.min(shuffled.length, HOME_GALLERY_PREVIEW_COUNT));
  if (preview.length === HOME_GALLERY_PREVIEW_COUNT) {
    return preview;
  }

  const padded = [...preview];
  let index = 0;
  while (padded.length < HOME_GALLERY_PREVIEW_COUNT) {
    const previewItem = preview[index % preview.length];
    if (previewItem) {
      padded.push(previewItem);
    }
    index += 1;
  }

  return padded;
};


export default function Index() {
  const { t, lang } = useLang();
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [portfolioManifest, setPortfolioManifest] = useState<Record<string, string[]>>({});
  const [activeHeroImage, setActiveHeroImage] = useState(0);
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);
  const marqueeOffsetRef = useRef(0);
  const marqueeVelocityRef = useRef(-HOME_AUTO_SCROLL_SPEED);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const dragStateRef = useRef({ dragging: false, lastX: 0, lastTime: 0 });
  const galleryMarqueeTrackRef = useRef<HTMLDivElement | null>(null);
  const galleryMarqueeOffsetRef = useRef(0);
  const galleryMarqueeVelocityRef = useRef(-HOME_AUTO_SCROLL_SPEED);
  const galleryAnimationFrameRef = useRef<number | null>(null);
  const galleryLastFrameTimeRef = useRef<number | null>(null);
  const galleryDragStateRef = useRef({ dragging: false, moved: false, lastY: 0, lastTime: 0 });
  const [galleryViewportHeight, setGalleryViewportHeight] = useState<number | null>(null);
  const language = lang === "tr" ? "TR" : "EN";
  const { index: i18n } = t;

  useEffect(() => {
    let isMounted = true;

    const loadImageSources = async () => {
      try {
        const galleryResponse = await fetch("/images/gallery/manifest.json", { cache: "no-store" });
        if (galleryResponse.ok) {
          const galleryData = await galleryResponse.json() as { images?: string[] };
          if (isMounted) {
            setHeroImages(galleryData.images ?? []);
          }
        } else if (isMounted) {
          setHeroImages([]);
        }
      } catch {
        if (isMounted) {
          setHeroImages([]);
        }
      }

      try {
        const portfolioResponse = await fetch("/images/portfolio/manifest.json", { cache: "no-store" });
        if (!portfolioResponse.ok) {
          return;
        }

        const data = await portfolioResponse.json() as { projects?: Record<string, string[]> };
        const manifestProjects = data.projects ?? {};
        if (!isMounted) {
          return;
        }

        setPortfolioManifest(manifestProjects);
      } catch {
        if (isMounted) {
          setPortfolioManifest({});
        }
      }
    };

    loadImageSources();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) {
      return;
    }

    setActiveHeroImage(Math.floor(Math.random() * heroImages.length));

    const interval = window.setInterval(() => {
      setActiveHeroImage((prev) => {
        if (heroImages.length <= 1) {
          return prev;
        }
        let next = prev;
        while (next === prev) {
          next = Math.floor(Math.random() * heroImages.length);
        }
        return next;
      });
    }, 7000);

    return () => {
      window.clearInterval(interval);
    };
  }, [heroImages.length]);

  const projectFrames = useMemo(() => (
    t.portfolio.projects
      .map((project, idx) => {
        const enProjectTitle = translations.en.portfolio.projects[idx]?.title ?? project.title;
        const slug = toProjectSlug(enProjectTitle);
        const images = portfolioManifest[slug] ?? EMPTY_IMAGES;
        const coverImage = images.length > 0 ? images[hashString(slug) % images.length] : "";
        return {
          ...project,
          slug,
          images,
          coverImage,
        };
      })
      .filter((project) => project.images.length > 0)
  ), [portfolioManifest, t.portfolio.projects]);
  const galleryPreviewImages = useMemo(() => getHomeGalleryPreviewImages(heroImages), [heroImages]);
  const galleryMarqueeImages = useMemo(
    () => (galleryPreviewImages.length > 0 ? [...galleryPreviewImages, ...galleryPreviewImages] : []),
    [galleryPreviewImages],
  );
  const hasPortfolioFrames = projectFrames.length > 0;
  const hasGalleryFrames = galleryPreviewImages.length > 0;

  const applyMarqueeTransform = () => {
    const track = marqueeTrackRef.current;
    if (!track) {
      return;
    }

    const loopWidth = track.scrollWidth / 2;
    if (!loopWidth) {
      return;
    }

    let offset = marqueeOffsetRef.current;
    while (offset <= -loopWidth) {
      offset += loopWidth;
    }
    while (offset > 0) {
      offset -= loopWidth;
    }

    marqueeOffsetRef.current = offset;
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
  };

  const syncGalleryViewportHeight = () => {
    const track = galleryMarqueeTrackRef.current;
    if (!track) {
      return;
    }

    const nextHeight = Math.round(track.scrollHeight / 2);
    if (!nextHeight) {
      return;
    }

    setGalleryViewportHeight((prevHeight) => (prevHeight === nextHeight ? prevHeight : nextHeight));
  };

  const applyGalleryMarqueeTransform = () => {
    const track = galleryMarqueeTrackRef.current;
    if (!track) {
      return;
    }

    const loopHeight = track.scrollHeight / 2;
    if (!loopHeight) {
      return;
    }

    let offset = galleryMarqueeOffsetRef.current;
    while (offset <= -loopHeight) {
      offset += loopHeight;
    }
    while (offset > 0) {
      offset -= loopHeight;
    }

    galleryMarqueeOffsetRef.current = offset;
    track.style.transform = `translate3d(0, ${offset}px, 0)`;
  };

  useEffect(() => {
    if (projectFrames.length === 0) {
      return;
    }

    marqueeOffsetRef.current = 0;
    marqueeVelocityRef.current = -HOME_AUTO_SCROLL_SPEED;
    applyMarqueeTransform();

    const tick = (timestamp: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp;
      }

      const deltaTime = Math.min((timestamp - lastFrameTimeRef.current) / 1000, 0.05);
      lastFrameTimeRef.current = timestamp;

      if (!dragStateRef.current.dragging) {
        marqueeVelocityRef.current = (marqueeVelocityRef.current * 0.92) + ((-HOME_AUTO_SCROLL_SPEED) * 0.08);
      }

      marqueeOffsetRef.current += marqueeVelocityRef.current * deltaTime;
      applyMarqueeTransform();
      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);
    const handleResize = () => applyMarqueeTransform();
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = null;
      lastFrameTimeRef.current = null;
      window.removeEventListener("resize", handleResize);
    };
  }, [projectFrames.length]);

  useEffect(() => {
    if (galleryPreviewImages.length === 0) {
      setGalleryViewportHeight(null);
      return;
    }

    galleryMarqueeOffsetRef.current = 0;
    galleryMarqueeVelocityRef.current = -HOME_AUTO_SCROLL_SPEED;
    applyGalleryMarqueeTransform();
    syncGalleryViewportHeight();

    const tick = (timestamp: number) => {
      if (galleryLastFrameTimeRef.current === null) {
        galleryLastFrameTimeRef.current = timestamp;
      }

      const deltaTime = Math.min((timestamp - galleryLastFrameTimeRef.current) / 1000, 0.05);
      galleryLastFrameTimeRef.current = timestamp;

      if (!galleryDragStateRef.current.dragging) {
        galleryMarqueeVelocityRef.current = (galleryMarqueeVelocityRef.current * 0.92) + ((-HOME_AUTO_SCROLL_SPEED) * 0.08);
      }

      galleryMarqueeOffsetRef.current += galleryMarqueeVelocityRef.current * deltaTime;
      applyGalleryMarqueeTransform();
      galleryAnimationFrameRef.current = window.requestAnimationFrame(tick);
    };

    galleryAnimationFrameRef.current = window.requestAnimationFrame(tick);
    const handleResize = () => {
      applyGalleryMarqueeTransform();
      syncGalleryViewportHeight();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (galleryAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(galleryAnimationFrameRef.current);
      }
      galleryAnimationFrameRef.current = null;
      galleryLastFrameTimeRef.current = null;
      window.removeEventListener("resize", handleResize);
    };
  }, [galleryPreviewImages.length]);

  const handlePortfolioWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!hasPortfolioFrames || projectFrames.length === 0) {
      return;
    }

    const dominantDelta = Math.abs(event.deltaX) >= Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(dominantDelta) < 0.8) {
      return;
    }

    event.preventDefault();
    const dragMotion = -dominantDelta * HOME_DRAG_FRICTION;
    marqueeOffsetRef.current += dragMotion;
    marqueeVelocityRef.current = (marqueeVelocityRef.current * 0.55) + (dragMotion * 18);
    applyMarqueeTransform();
  };

  const handlePortfolioMouseEnter = () => {
    if (!hasPortfolioFrames || projectFrames.length === 0) {
      return;
    }
    // Stop auto-scrolling when hovering
    marqueeVelocityRef.current = 0;
  };

  const handlePortfolioMouseLeave = () => {
    if (!hasPortfolioFrames || projectFrames.length === 0) {
      return;
    }
    // Resume auto-scrolling when not hovering
    marqueeVelocityRef.current = -HOME_AUTO_SCROLL_SPEED;
  };

  const handlePortfolioPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!hasPortfolioFrames || event.pointerType !== "mouse" || projectFrames.length === 0) {
      return;
    }

    event.preventDefault();
    dragStateRef.current.dragging = true;
    dragStateRef.current.lastX = event.clientX;
    dragStateRef.current.lastTime = performance.now();
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePortfolioPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.dragging || event.pointerType !== "mouse") {
      return;
    }

    const now = performance.now();
    const deltaX = event.clientX - dragStateRef.current.lastX;
    const deltaTime = Math.max((now - dragStateRef.current.lastTime) / 1000, 0.001);
    dragStateRef.current.lastX = event.clientX;
    dragStateRef.current.lastTime = now;

    const dragMotion = deltaX * HOME_DRAG_FRICTION;
    marqueeOffsetRef.current += dragMotion;
    marqueeVelocityRef.current = dragMotion / deltaTime;
    applyMarqueeTransform();
  };

  const handlePortfolioPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStateRef.current.dragging = false;
  };

  const handleGalleryWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!hasGalleryFrames || galleryPreviewImages.length === 0) {
      return;
    }

    const dominantDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (Math.abs(dominantDelta) < 0.8) {
      return;
    }

    event.preventDefault();
    const dragMotion = -dominantDelta * HOME_DRAG_FRICTION;
    galleryMarqueeOffsetRef.current += dragMotion;
    galleryMarqueeVelocityRef.current = (galleryMarqueeVelocityRef.current * 0.55) + (dragMotion * 18);
    applyGalleryMarqueeTransform();
  };

  const handleGalleryMouseEnter = () => {
    if (!hasGalleryFrames || galleryPreviewImages.length === 0) {
      return;
    }
    // Stop auto-scrolling when hovering
    galleryMarqueeVelocityRef.current = 0;
  };

  const handleGalleryMouseLeave = () => {
    if (!hasGalleryFrames || galleryPreviewImages.length === 0) {
      return;
    }
    // Resume auto-scrolling when not hovering
    galleryMarqueeVelocityRef.current = -HOME_AUTO_SCROLL_SPEED;
  };

  const handleGalleryPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!hasGalleryFrames || event.pointerType !== "mouse" || galleryPreviewImages.length === 0) {
      return;
    }

    galleryDragStateRef.current.dragging = true;
    galleryDragStateRef.current.moved = false;
    galleryDragStateRef.current.lastY = event.clientY;
    galleryDragStateRef.current.lastTime = performance.now();
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleGalleryPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!galleryDragStateRef.current.dragging || event.pointerType !== "mouse") {
      return;
    }

    const now = performance.now();
    const deltaY = event.clientY - galleryDragStateRef.current.lastY;
    const deltaTime = Math.max((now - galleryDragStateRef.current.lastTime) / 1000, 0.001);
    galleryDragStateRef.current.lastY = event.clientY;
    galleryDragStateRef.current.lastTime = now;
    if (Math.abs(deltaY) > 2) {
      galleryDragStateRef.current.moved = true;
    }

    const dragMotion = deltaY * HOME_DRAG_FRICTION;
    galleryMarqueeOffsetRef.current += dragMotion;
    galleryMarqueeVelocityRef.current = dragMotion / deltaTime;
    applyGalleryMarqueeTransform();
  };

  const handleGalleryPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    galleryDragStateRef.current.dragging = false;
  };

  const handleGalleryClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!galleryDragStateRef.current.moved) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    galleryDragStateRef.current.moved = false;
  };


  return (
    <main className="bg-background">
      {/* ── Hero – Full-screen video ──────────────────────── */}
      <section className="hero-fixed-theme home-hero relative h-screen md:min-h-[780px] lg:min-h-[900px] xl:min-h-[950px] flex items-center justify-center overflow-hidden">
        <div className="home-hero-base absolute inset-0" />
        {heroImages.length > 0 ? (
          <div className="absolute inset-0">
            {heroImages.map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt=""
                aria-hidden="true"
                loading="eager"
                className="home-hero-image absolute inset-0 w-full h-full object-cover"
                style={{
                  opacity: index === activeHeroImage ? "var(--home-hero-image-opacity, 0.48)" : 0,
                  transform: index === activeHeroImage ? "scale(1.04)" : "scale(1)",
                  filter: index === activeHeroImage
                    ? "brightness(var(--home-hero-brightness, 0.72)) saturate(var(--home-hero-saturation, 0.82))"
                    : "brightness(var(--home-hero-brightness, 0.72)) saturate(var(--home-hero-saturation, 0.82))",
                  transition: "opacity 1500ms cubic-bezier(0.4, 0, 0.2, 1), transform 8000ms cubic-bezier(0.4, 0, 0.2, 1)",
                  willChange: "opacity, transform",
                }}
              />
            ))}
          </div>
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="home-hero-video absolute inset-0 w-full h-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        )}
        <div className="home-hero-overlay absolute inset-0" />

        <div className="relative z-10 text-center px-8">
          <div className="mb-6">
            <span className="home-hero-brand font-serif text-5xl md:text-7xl lg:text-8xl text-cream tracking-[0.12em] uppercase whitespace-nowrap">
              Demonte Concept
            </span>
          </div>

          <h1
            className="home-hero-headline font-serif text-cream/90 text-3xl md:text-4xl lg:text-5xl leading-tight mb-4"
          >
            {i18n.headline}
          </h1>

          <p
            className="home-hero-subline font-sans text-cream/60 text-sm md:text-base lg:text-lg tracking-widest uppercase mb-12"
          >
            {i18n.subline}
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/portfolio" className="btn-primary-luxury">
              {i18n.cta1}
            </Link>
            <Link to="/contact" className="btn-outline-luxury">
              {i18n.cta2}
            </Link>
          </div>
        </div>
      </section>

      <section className="home-about-section relative py-28 bg-gradient-to-b from-neutral-50 to-white overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-16 w-64 h-64 rounded-full bg-charcoal/10 blur-3xl" />
        <div className="relative max-w-screen-xl mx-auto px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-6">
                <div className="section-divider" />
                <span className="font-sans text-[0.65rem] tracking-widest-xl uppercase text-gold">
                  {language === "TR" ? "Demonte Concept" : "Demonte Concept"}
                </span>
              </div>
              <h2 className="font-serif text-foreground text-4xl md:text-5xl leading-tight mb-8">
                {language === "TR" ? "Hakkımızda" : "About Us"}
              </h2>
              <div className="space-y-6 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl">
                <p>
                  {language === "TR"
                    ? "Demonte Concept'te her proje, güçlü bir tasarım fikriyle başlar ve bütüncül bir yaşam deneyimine dönüşür. Üst segment mekanlar için özgün kimlik taşıyan, zamana karşı güçlü kalan ve yüksek estetik değeri olan alanlar üretiriz."
                    : "At Demonte Concept, every project begins with a clear design vision and evolves into a complete living experience. For high-end spaces, we create interiors with a distinct identity, lasting value, and refined visual clarity."}
                </p>
                <p>
                  {language === "TR"
                    ? "Tasarım kararından son uygulama detayına kadar tüm adımları aynı kalite standardıyla yönetiriz. Böylece ortaya çıkan sonuç, yalnızca güzel görünen bir mekan değil; karakteri, işlevi ve hissiyle güçlü bir bütünlük olur."
                    : "From first design decision to final implementation detail, we manage every stage under one quality standard. The result is not only visually striking, but also cohesive in character, function, and atmosphere."}
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#craft-process"
                  className="btn-dark-luxury inline-flex items-center gap-2"
                >
                  {language === "TR" ? "Sürecimizi Keşfedin" : "Explore Our Process"}
                  <ArrowRight size={14} />
                </a>
                <a
                  href="https://www.instagram.com/demonteconcept?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs tracking-widest uppercase px-5 py-3 border border-border text-foreground hover:border-gold hover:text-gold transition-colors duration-300"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/demonteconcept/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs tracking-widest uppercase px-5 py-3 border border-border text-foreground hover:border-gold hover:text-gold transition-colors duration-300"
                >
                  Facebook
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                  <span className="font-sans text-[0.65rem] tracking-widest uppercase text-gold">
                    01
                  </span>
                  <h3 className="font-serif text-foreground text-2xl mt-3 mb-2">
                    {language === "TR" ? "Özel Tasarım" : "Bespoke Design"}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                    {language === "TR"
                      ? "Mekana özel geliştirilen konseptler, malzeme dili ve karakterli detaylar."
                      : "Tailor-made concepts, material language, and signature details designed for each space."}
                  </p>
                </div>

                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                  <span className="font-sans text-[0.65rem] tracking-widest uppercase text-gold">
                    02
                  </span>
                  <h3 className="font-serif text-foreground text-2xl mt-3 mb-2">
                    {language === "TR" ? "Kurum İçi Üretim" : "In-House Production"}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                    {language === "TR"
                      ? "Deneyimli ekiplerimizin kontrolünde, tasarımla birebir uyumlu üretim."
                      : "Precision manufacturing under experienced teams to match the approved design exactly."}
                  </p>
                </div>

                <div className="bg-charcoal rounded-2xl p-6 sm:col-span-2 lg:col-span-1">
                  <span className="font-sans text-[0.65rem] tracking-widest uppercase text-gold">
                    03
                  </span>
                  <h3 className="font-serif text-cream text-2xl mt-3 mb-2">
                    {language === "TR" ? "Anahtar Teslim Uygulama" : "Turnkey Installation"}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-cream/70">
                    {language === "TR"
                      ? "Sahada doğru uygulama ve son stil dokunuşlarıyla tasarımın eksiksiz tamamlanması."
                      : "On-site execution and final styling to deliver the complete interior as designed."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="craft-process" className="py-24 bg-cream-dark">
        <div className="max-w-screen-xl mx-auto px-8">
          <div className="max-w-4xl mb-14">
            <div className="flex items-center gap-4 mb-6">
              <div className="section-divider" />
              <span className="font-sans text-[0.65rem] tracking-widest-xl uppercase text-gold">
                {language === "TR" ? "Süreç" : "Process"}
              </span>
            </div>
            <h2 className="font-serif text-foreground text-4xl md:text-5xl leading-tight mb-6">
              {language === "TR" ? "Tasarımdan Üretime Yolculuk" : "From Concept to Craft"}
            </h2>
            <p className="font-sans text-base md:text-lg leading-relaxed text-muted-foreground">
              {language === "TR"
                ? "İç mekan dekorasyon sürecimiz; üst düzey iç mimarların hazırladığı konsept, tasarım ve görselleştirme çalışmalarının sizinle birlikte netleştirilmesiyle başlar. Onaylanan her detay, kurum içi üretim ekibimize eksiksiz aktarılır. Deneyimli ustalarımız her parçayı tasarıma sadık kalarak üretir; ardından uygulama ekiplerimiz sahada montaj ve yerleşimi gerçekleştirerek mekanı tasarımdaki bütünlüğüyle hayata geçirir."
                : "Our interior decoration process starts with concept development, design, and curated renders prepared by top-level interior decorators and finalized together with you. Every approved detail is then transferred directly to our in-house production team. Experienced craftsmen produce each bespoke piece in full alignment with the design, and our installation teams complete the on-site execution to deliver the space exactly as envisioned."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="font-sans text-xs tracking-widest uppercase text-gold mb-4">01</div>
              <h3 className="font-serif text-2xl text-foreground mb-3">
                {language === "TR" ? "Konsept" : "Concept"}
              </h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                {language === "TR"
                  ? "Mekan analizi, ihtiyaç programı ve stil yönlendirmesi."
                  : "Space analysis, design brief, and creative direction."}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="font-sans text-xs tracking-widest uppercase text-gold mb-4">02</div>
              <h3 className="font-serif text-2xl text-foreground mb-3">
                {language === "TR" ? "Tasarım ve Görselleştirme" : "Design & Render"}
              </h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                {language === "TR"
                  ? "Kurgu, malzeme ve detayların görselleştirilip birlikte onaylanması."
                  : "Visualized layouts, materials, and details for final approval."}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="font-sans text-xs tracking-widest uppercase text-gold mb-4">03</div>
              <h3 className="font-serif text-2xl text-foreground mb-3">
                {language === "TR" ? "Kurum İçi Üretim" : "In-House Craft"}
              </h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                {language === "TR"
                  ? "Özel üretim parçaların usta ekiplerce birebir uygulanması."
                  : "Bespoke pieces produced by experienced craftsmen with precision."}
              </p>
            </div>

            <div className="bg-charcoal rounded-2xl p-6">
              <div className="font-sans text-xs tracking-widest uppercase text-gold mb-4">04</div>
              <h3 className="font-serif text-2xl text-cream mb-3">
                {language === "TR" ? "Montaj ve Teslim" : "Install & Deliver"}
              </h3>
              <p className="font-sans text-sm text-cream/70 leading-relaxed">
                {language === "TR"
                  ? "Saha montajı, son dokunuşlar ve tasarıma sadık final teslim."
                  : "On-site installation, final styling, and delivery as designed."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Portfolio Preview Grid ────────────────────────── */}
      <section className="py-24 bg-cream-dark">
        <div className="max-w-screen-xl mx-auto px-8">
          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="section-divider" />
                <span className="font-sans text-[0.65rem] tracking-widest-xl uppercase text-gold">
                  {i18n.portfolioEyebrow}
                </span>
              </div>
              <h2 className="font-serif text-foreground text-4xl md:text-5xl leading-tight">
                {i18n.portfolioHeadline}
              </h2>
            </div>
            <Link
              to="/portfolio"
              className="hidden md:flex items-center gap-3 font-sans text-xs tracking-widest uppercase text-muted-foreground hover:text-gold transition-colors duration-300"
            >
              {i18n.viewAll} <ArrowRight size={14} />
            </Link>
          </div>

          <div
            className={`relative select-none ${hasPortfolioFrames ? "cursor-grab active:cursor-grabbing" : ""}`}
            onWheel={handlePortfolioWheel}
            onPointerDown={handlePortfolioPointerDown}
            onPointerMove={handlePortfolioPointerMove}
            onPointerUp={handlePortfolioPointerEnd}
            onPointerCancel={handlePortfolioPointerEnd}
            onPointerLeave={handlePortfolioPointerEnd}
            onMouseEnter={handlePortfolioMouseEnter}
            onMouseLeave={handlePortfolioMouseLeave}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cream-dark to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-cream-dark to-transparent z-10" />
            {projectFrames.length > 0 ? (
              <div className="overflow-hidden">
                <div
                  ref={marqueeTrackRef}
                  className="flex w-max gap-6 will-change-transform"
                  style={{ transform: "translate3d(0, 0, 0)" }}
                >
                  {[...projectFrames, ...projectFrames].map((project, idx) => {
                    const activeImage = project.coverImage || project.images[0];
                    return (
                    <Link
                      to={`/portfolio/${project.slug}`}
                      key={`${project.slug}-${idx}`}
                      className="project-card frame-lift group block shrink-0 w-[78vw] sm:w-[46vw] lg:w-[30vw] max-w-[420px] min-w-[260px] cursor-pointer"
                    >
                      <div className="aspect-[4/5] overflow-hidden relative">
                        <img
                          key={`${project.slug}-fixed`}
                          src={activeImage}
                          alt={project.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="frame-caption-layer">
                          <div className="frame-caption-content">
                            <span className="frame-caption-kicker font-sans text-[0.6rem] tracking-widest uppercase block mb-2">
                              {project.category}
                            </span>
                            <h3 className="frame-caption-title font-serif text-xl leading-tight">{project.title}</h3>
                          </div>
                        </div>
                      </div>
                    </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-[420px] flex items-center justify-center border border-border text-muted-foreground font-sans text-xs tracking-widest uppercase">
                {language === "TR" ? "Görseller Hazırlanıyor" : "Portfolio Visuals Loading"}
              </div>
            )}
          </div>

          <div className="mt-10 flex justify-center md:hidden">
            <Link to="/portfolio" className="btn-dark-luxury">
              {i18n.viewAll}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-t border-border/60">
        <div className="max-w-screen-xl mx-auto px-8">
          <div className="max-w-4xl mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="section-divider" />
              <span className="font-sans text-[0.65rem] tracking-widest-xl uppercase text-gold">
                {language === "TR" ? "Galeri" : "Gallery"}
              </span>
            </div>
            <h2 className="font-serif text-foreground text-4xl md:text-5xl leading-tight mb-6">
              {language === "TR" ? "İlham Veren Tasarımlar" : "Inspiration Gallery"}
            </h2>
            <p className="font-sans text-base md:text-lg leading-relaxed text-muted-foreground">
              {language === "TR"
                ? "Burada öne çıkan görselleri inceleyebilir, tüm galeriyi açarak daha fazla örnek görebilirsiniz."
                : "Explore featured visuals here, then open the full gallery to see more examples."}
            </p>
          </div>

          {galleryPreviewImages.length > 0 ? (
            <>
              <div
                className={`relative select-none ${hasGalleryFrames ? "cursor-grab active:cursor-grabbing" : ""}`}
                onWheel={handleGalleryWheel}
                onPointerDown={handleGalleryPointerDown}
                onPointerMove={handleGalleryPointerMove}
                onPointerUp={handleGalleryPointerEnd}
                onPointerCancel={handleGalleryPointerEnd}
                onPointerLeave={handleGalleryPointerEnd}
                onClickCapture={handleGalleryClickCapture}
                onMouseEnter={handleGalleryMouseEnter}
                onMouseLeave={handleGalleryMouseLeave}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent z-10" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent z-10" />
                <div className="overflow-hidden" style={galleryViewportHeight ? { height: `${galleryViewportHeight}px` } : undefined}>
                  <div
                    ref={galleryMarqueeTrackRef}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 will-change-transform"
                    style={{ transform: "translate3d(0, 0, 0)" }}
                  >
                    {galleryMarqueeImages.map((image, idx) => (
                      <Link
                        key={`${image}-${idx}`}
                        to="/gallery"
                        className="group block"
                      >
                      <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border relative">
                        <img
                          src={image}
                          alt={language === "TR" ? "Galeri Görseli" : "Gallery Image"}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute left-4 right-4 bottom-4 flex items-center justify-between opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                          <span className="font-sans text-[0.58rem] tracking-widest uppercase text-cream">
                            {language === "TR" ? "Tüm Galeriyi Aç" : "Open Full Gallery"}
                          </span>
                          <span className="w-8 h-8 rounded-full border border-gold/70 bg-charcoal/70 text-gold inline-flex items-center justify-center">
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 bg-charcoal rounded-2xl border border-charcoal-soft px-8 py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <p className="font-serif text-cream text-2xl md:text-3xl leading-tight mb-2">
                    {language === "TR" ? "Size uygun stili birlikte planlayalım." : "Let's find the right style for your space."}
                  </p>
                  <p className="font-sans text-cream/60 text-sm md:text-base leading-relaxed">
                    {language === "TR"
                      ? "Tüm galeriyi inceleyin veya size özel yönlendirme için randevu oluşturun."
                      : "Browse the full gallery or book an appointment for personalized guidance."}
                  </p>
                </div>
                <Link
                  to="/gallery"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gold text-charcoal font-sans text-[0.65rem] tracking-widest uppercase hover:bg-gold/90 transition-colors duration-300"
                >
                  {language === "TR" ? "Tüm Galeriyi Aç" : "Open Full Gallery"}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-border bg-cream-dark py-12 px-8 text-center">
              <p className="font-sans text-sm tracking-wider uppercase text-muted-foreground mb-6">
                {language === "TR" ? "Galeri Görselleri Hazırlanıyor" : "Gallery Visuals Are Being Prepared"}
              </p>
              <Link to="/gallery" className="btn-dark-luxury inline-flex items-center gap-2">
                {language === "TR" ? "Galeriyi Gör" : "View Gallery"}
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Minimal Studio Statement ─────────────────────── */}
      <section className="py-32 max-w-screen-xl mx-auto px-8 text-center">
        <div className="section-divider mx-auto mb-10" />
        <p className="font-sans text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          {i18n.studioStatement}
        </p>
      </section>

      {/* ── Contact CTA Strip ────────────────────────────── */}
      <section className="bg-charcoal py-24">
        <div className="max-w-screen-xl mx-auto px-8 text-center">
          <h2 className="font-serif text-cream text-3xl md:text-5xl leading-tight mb-4">
            {i18n.ctaHeadline}
          </h2>
          <p className="font-sans text-cream/50 text-base mb-10">
            {i18n.ctaBody}
          </p>
          <Link to="/contact" className="btn-primary-luxury">
            {i18n.ctaBtn}
          </Link>
        </div>
      </section>
    </main>
  );
}
