import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Database, Users, Home, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 relative">
      {/* --- TOP RIGHT NAVIGATION --- */}
      <nav className="absolute top-0 right-0 p-4 md:p-6 flex items-center gap-4 z-50">
        <Link to="/">
          <Button
            variant="ghost"
            className="gap-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <Home className="w-4 h-4" /> Home
          </Button>
        </Link>

        <Link to="/contact">
          <Button
            variant="ghost"
            className="gap-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <Mail className="w-4 h-4" /> Contact
          </Button>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-12 pt-10">
        {/* Header */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight pb-2">
            About the Project
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-6">
              Welcome to our Bengaluru Cost of Living guide!
            </p>

            <div className="space-y-6 text-foreground/90">
              <p>
                We are a team of 5th-semester Computer Science and Business
                Systems (CSBS) students from KS School of Engineering and
                Management. We created this platform to provide clear,
                comprehensive, and up-to-date information on living expenses
                across Bengaluru.
              </p>

              <p>
                Our mission is to help residents, newcomers, and businesses make
                informed decisions about living and working in this dynamic
                city. We provide a detailed breakdown of costs across various
                neighborhoods, covering essential categories like:
              </p>

              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Housing</li>
                <li>Food</li>
                <li>Transportation</li>
                <li>Utilities</li>
                <li>Entertainment</li>
              </ul>

              <p>
                Whether you're planning a move, considering a new neighborhood,
                or simply curious about expenses, our platform offers the
                insights you need.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-900 pt-8 text-center text-slate-600 text-sm">
          © 2025 Bengaluru Living Cost Project. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default About;
