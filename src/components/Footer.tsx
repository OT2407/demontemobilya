import { Link } from "react-router-dom";
import { Instagram, Facebook, Phone, Mail, MapPin } from "lucide-react";
import { useLang } from "@/lib/i18n";
import BrandLogo from "@/components/BrandLogo";

const toRouteTarget = (path: string) => {
  if (!path.includes("#")) {
    return path;
  }

  const [pathname, hash] = path.split("#");
  return {
    pathname: pathname || "/",
    hash: hash ? `#${hash}` : "",
  };
};

export default function Footer() {
  const { t } = useLang();
  const f = t.footer;

  return (
    <footer className="bg-charcoal text-cream/70">
      <div className="max-w-screen-xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <div className="mb-6 inline-flex items-center">
            <BrandLogo
              variant="light"
              slot="footer"
              logoType="logo-2"
              imgClassName="footer-logo-adaptive h-24 md:h-28 w-auto"
              textClassName="text-2xl tracking-wide"
            />
          </div>
          <p className="font-sans text-sm leading-relaxed text-cream/50 mb-6">
            {f.description}
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/demonteconcept?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-cream/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors duration-300"
              aria-label="Instagram"
            >
              <Instagram size={14} />
            </a>
            <a
              href="https://www.facebook.com/demonteconcept/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-cream/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors duration-300"
              aria-label="Facebook"
            >
              <Facebook size={14} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <ul className="space-y-3">
            {f.nav.map((item) => (
              <li key={item.path}>
                <Link
                  to={toRouteTarget(item.path)}
                  className="font-sans text-sm text-cream/50 hover:text-gold transition-colors duration-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-sans text-[0.65rem] font-500 tracking-widest-xl uppercase text-gold mb-6">{f.contactLabel}</h4>
          <ul className="space-y-4">
            <li className="flex gap-3 items-start">
              <MapPin size={14} className="mt-0.5 text-gold shrink-0" />
              <span className="font-sans text-sm text-cream/50 leading-relaxed">
                Ktezo Sanayi Sitesi No 22<br />Lefkoşa, Cyprus
              </span>
            </li>
            <li className="flex gap-3 items-center">
              <Phone size={14} className="text-gold shrink-0" />
              <a href="tel:+905488354770" className="font-sans text-sm text-cream/50 hover:text-gold transition-colors duration-300">
                +90 548 835 47 70
              </a>
            </li>
            <li className="flex gap-3 items-center">
              <Mail size={14} className="text-gold shrink-0" />
              <a href="mailto:iletisim@demonteconcept.com" className="font-sans text-sm text-cream/50 hover:text-gold transition-colors duration-300 break-all">
                iletisim@demonteconcept.com
              </a>
            </li>
          </ul>
          <div className="mt-6 pt-6 border-t border-cream/10">
            <p className="font-sans text-xs text-cream/30 uppercase tracking-widest">
              {f.hours}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="max-w-screen-xl mx-auto px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-cream/30">
            © {new Date().getFullYear()} Demonte Concept. {f.allRights}
          </p>
          <div className="flex gap-6">
            <Link to="/terms" className="font-sans text-xs text-cream/30 hover:text-gold transition-colors">
              {f.terms}
            </Link>
            <Link to="/privacy" className="font-sans text-xs text-cream/30 hover:text-gold transition-colors">
              {f.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
