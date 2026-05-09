import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative mt-16 md:mt-24 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 text-center sm:text-left">
          <div className="md:col-span-1">
            <h3 className="text-xl md:text-2xl font-heading font-bold text-gradient mb-3">Clothify Shopping</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto sm:mx-0">
              Premium fashion by Ridwan Ahmed. Redefining style with modern elegance.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Shop", "Categories", "Trending", "About"].map(l => (
                <li key={l}>
                  <Link to={l === "Home" ? "/" : `/${l.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 break-words">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Categories</h4>
            <ul className="space-y-2">
              {["Panjabi", "Shirt", "T-Shirt", "Hoodie", "Jacket"].map(c => (
                <li key={c}>
                  <Link to={`/${c.toLowerCase().replace("-", "")}`} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 break-words">{c}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Owner: Ridwan Ahmed</li>
              <li>Phone: 01308379952</li>
              <li>Email: ridu16540@gmail.com</li>
              <li className="pt-2 flex flex-wrap justify-center sm:justify-start gap-x-3 gap-y-2">
                {["Facebook", "Instagram", "Twitter"].map(s => (
                  <a key={s} href="#" className="hover:text-primary transition-colors duration-300">{s}</a>
                ))}
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 md:mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground leading-relaxed">
          © {new Date().getFullYear()} Clothify Shopping. All rights reserved. Designed with ♥ by Ridwan Ahmed.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
