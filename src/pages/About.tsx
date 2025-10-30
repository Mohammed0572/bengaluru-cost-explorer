import { Home, Info, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost" size="icon">
              <Info className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="ghost" size="icon">
              <Mail className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            About Us
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-6">
              Welcome to our Cost of Living platform for Bengaluru, India.
            </p>
            
            <div className="space-y-6 text-foreground/90">
              <p>
                We provide comprehensive and up-to-date information about the cost of living across different areas in Bengaluru. Our platform helps residents, newcomers, and businesses make informed decisions about where to live and work in the city.
              </p>
              
              <p>
                Our data covers essential categories including housing, food, transportation, utilities, and entertainment, giving you a complete picture of expenses in various neighborhoods throughout Bengaluru.
              </p>
              
              <p>
                Whether you're planning to move to Bengaluru, considering a different neighborhood, or simply curious about living costs, our platform provides the insights you need.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
