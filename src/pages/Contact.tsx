import { Home, Info, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Contact = () => {
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
            Contact Us
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12">
            Get in touch with us for any questions or feedback.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <Mail className="h-8 w-8 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground">
                contact@costoflivingbengaluru.com
              </p>
            </Card>

            <Card className="p-6">
              <Info className="h-8 w-8 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Support</h3>
              <p className="text-muted-foreground">
                We typically respond within 24 hours
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
