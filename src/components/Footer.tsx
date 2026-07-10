import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const quickLinks = ["Home", "Shop", "Categories", "Trending", "About"];
const socials = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
];

const Footer = () => {
  return (
    <footer className="relative mt-12 md:mt-20 bg-white/5 backdrop-blur-lg border-t border-white/10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute inset-x-0 -top-12 h-12 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Main row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 text-center md:text-left">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-base md:text-lg font-heading font-bold text-gradient mb-1.5">
              Clothify Shopping
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto md:mx-0">
              Premium fashion by City University 63rd Student.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-2">
              Explore
            </h4>
            <ul className="flex flex-wrap justify-center md:justify-start gap-x-3 gap-y-1 md:block md:space-y-1">
              {quickLinks.map((l) => (
                <li key={l}>
                  <Link
                    to={l === "Home" ? "/" : `/${l.toLowerCase()}`}
                    className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-2">
              Contact
            </h4>
            <ul className="space-y-0.5 text-xs md:text-sm text-muted-foreground">
              <li>Ridwan Ahmed</li>
              <li>01308379952</li>
              <li className="truncate">ridu16540@gmail.com</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-2">
              Follow
            </h4>
            <div className="flex justify-center md:justify-start gap-2.5">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:shadow-[0_0_12px_hsl(var(--primary)/0.4)] transition-all duration-300"
                >
                  <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
