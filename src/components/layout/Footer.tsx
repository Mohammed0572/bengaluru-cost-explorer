import { Link } from "react-router-dom";
import { Github, Twitter, Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full bg-card border-t mt-12 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Branding Column */}
        <div className="md:col-span-5 lg:col-span-4 space-y-6">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-primary">Cost Explorer</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Empowering Bengaluru residents with transparent, real-time cost of living data.
            </p>
          </div>
        </div>

        {/* Spacer for Desktop */}
        <div className="hidden lg:block lg:col-span-4"></div>

        {/* Links Columns */}
        <div className="md:col-span-7 lg:col-span-4 grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide uppercase">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide uppercase">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          © {new Date().getFullYear()} Bengaluru Cost Explorer. All rights reserved.
        </p>
        
        <div className="flex items-center gap-4">
          <a href="#" className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};
