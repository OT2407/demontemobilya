import { useState, useEffect, useRef } from "react";
import { Link, useLocation, type To } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useLang } from "@/lib/i18n";
import BrandLogo from "@/components/BrandLogo";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const pagesMenuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { lang, setLang, t } = useLang();

  const pageItems: Array<{ label: string; to: To; key: string }> = [
    { label: t.nav.home, to: "/", key: "home" },
    { label: t.nav.portfolio, to: "/portfolio", key: "portfolio" },
    { label: t.nav.gallery, to: "/gallery", key: "gallery" },
    { label: t.nav.contact, to: "/contact", key: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme: "light" | "dark" = saved === "dark" || saved === "light"
      ? saved
      : prefersDark
        ? "dark"
        : "light";

    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    document.documentElement.style.colorScheme = initialTheme;
  }, []);

  useEffect(() => {
    if (!pagesOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (!pagesMenuRef.current?.contains(event.target as Node)) {
        setPagesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [pagesOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setPagesOpen(false);
  }, [location]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    document.documentElement.style.colorScheme = nextTheme;
  };

  const isLightTheme = theme === "light";
  const navBg = scrolled
    ? (isLightTheme
      ? "bg-cream/95 backdrop-blur-sm border-b border-border"
      : "bg-charcoal/95 backdrop-blur-sm border-b border-charcoal-soft")
    : isHome
    ? "bg-transparent"
    : (isLightTheme ? "bg-cream border-b border-border" : "bg-charcoal");
  const headerButtonToneClass = isHome && !scrolled ? "header-action-hero" : "header-action-surface";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
      >
        <div className="w-full pl-6 pr-8 md:pl-6 md:pr-10 flex items-center justify-between h-20">
          <Link to="/" className="inline-flex items-center">
            <BrandLogo
              variant="light"
              slot="nav"
              imgClassName="nav-logo-adaptive h-[11.2rem] md:h-[12.8rem] w-auto"
              textClassName="text-xl tracking-wide"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <div ref={pagesMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setPagesOpen((prev) => !prev)}
                className={`header-action-btn ${headerButtonToneClass} inline-flex items-center justify-center w-12 h-12`}
                aria-label={lang === "tr" ? "Sayfa menüsü" : "Pages menu"}
                aria-expanded={pagesOpen}
                aria-haspopup="true"
                aria-controls="pages-menu"
              >
                {pagesOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              {pagesOpen ? (
                <div 
                  id="pages-menu"
                  className={`absolute right-0 mt-2 min-w-[200px] backdrop-blur-sm py-2 ${
                    isLightTheme
                      ? "border border-border bg-card/95"
                      : "border border-cream/20 bg-charcoal/95"
                  }`}
                >
                  {pageItems.map((item) => (
                    <Link
                      key={item.key}
                      to={item.to}
                      className={`block px-4 py-2 font-sans text-[0.65rem] tracking-widest uppercase transition-colors duration-300 ${
                        isLightTheme
                          ? "text-foreground/70 hover:text-gold hover:bg-muted/60"
                          : "text-cream/70 hover:text-gold hover:bg-charcoal-soft/50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={`header-action-btn ${headerButtonToneClass} inline-flex items-center gap-2 font-sans text-[0.65rem] tracking-widest uppercase px-3 py-2`}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              {theme === "dark" ? (lang === "tr" ? "Açık" : "Light") : (lang === "tr" ? "Koyu" : "Dark")}
            </button>
            <button
              onClick={() => setLang(lang === "en" ? "tr" : "en")}
              className={`header-action-btn ${headerButtonToneClass} font-sans text-[0.65rem] tracking-widest uppercase px-2 py-1`}
              aria-label="Toggle language"
            >
              {lang === "en" ? "TR" : "EN"}
            </button>
          </nav>

          <button
            className={`header-mobile-toggle ${headerButtonToneClass} lg:hidden p-2`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center items-center transition-all duration-500 ${
          isLightTheme ? "bg-cream" : "bg-charcoal"
        } ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-8">
          {pageItems.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className={`nav-link text-sm ${
                isLightTheme ? "text-foreground/70 hover:text-gold" : "text-cream/70 hover:text-gold"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            className={`font-sans text-xs tracking-widest uppercase transition-colors duration-300 px-3 py-1.5 mt-2 inline-flex items-center gap-2 ${
              isLightTheme
                ? "text-foreground/55 hover:text-gold border border-border hover:border-gold"
                : "text-cream/50 hover:text-gold border border-cream/20 hover:border-gold"
            }`}
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            {theme === "dark" ? (lang === "tr" ? "Açık Mod" : "Light Mode") : (lang === "tr" ? "Koyu Mod" : "Dark Mode")}
          </button>
          <button
            onClick={() => setLang(lang === "en" ? "tr" : "en")}
            className={`font-sans text-xs tracking-widest uppercase transition-colors duration-300 px-3 py-1.5 mt-2 ${
              isLightTheme
                ? "text-foreground/55 hover:text-gold border border-border hover:border-gold"
                : "text-cream/50 hover:text-gold border border-cream/20 hover:border-gold"
            }`}
          >
            {lang === "en" ? "Türkçe" : "English"}
          </button>
        </nav>
      </div>
    </>
  );
}
