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
              Welcome to our Bengaluru Cost of Living guide!
            </p>
            
            <div className="space-y-6 text-foreground/90">
              <p>
                We are a team of 5th-semester Computer Science and Business Systems (CSBS) students from KS School of Engineering and Management. We created this platform to provide clear, comprehensive, and up-to-date information on living expenses across Bengaluru.
              </p>
              
              <p>
                Our mission is to help residents, newcomers, and businesses make informed decisions about living and working in this dynamic city. We provide a detailed breakdown of costs across various neighborhoods, covering essential categories like:
              </p>
              
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Housing</li>
                <li>Food</li>
                <li>Transportation</li>
                <li>Utilities</li>
                <li>Entertainment</li>
              </ul>
              
              <p>
                Whether you're planning a move, considering a new neighborhood, or simply curious about expenses, our platform offers the insights you need.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
