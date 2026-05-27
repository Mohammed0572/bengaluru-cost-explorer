import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Home, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
              Cost of Living Bengaluru
          </h2>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" className="gap-2 hover:bg-muted/50 transition-all">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" className="gap-2 hover:bg-muted/50 transition-all">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">About</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="space-y-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Get in Touch</h2>
            <p className="text-muted-foreground mt-2">Have a question or want to report an issue? We'd love to hear from you.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Contact Info */}
            <div className="space-y-6 md:col-span-1">
              <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>hello@bengalurucost.com</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Indiranagar, Bengaluru</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2 bg-card border rounded-2xl p-6 shadow-sm">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="John Doe" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="john@example.com" className="bg-background" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea placeholder="How can we help?" className="min-h-[120px] resize-none bg-background" />
                </div>
                <Button className="w-full sm:w-auto mt-2">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;