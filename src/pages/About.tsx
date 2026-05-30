import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Database, MapPinned, Users } from "lucide-react";

const focusAreas = [
  { label: "Housing", description: "Rent, deposits, PG stays, and shared homes across major neighborhoods." },
  { label: "Food", description: "Everyday meals, cafes, restaurants, groceries, and local staples." },
  { label: "Transportation", description: "Metro passes, autos, fuel, commute patterns, and ride costs." },
  { label: "Utilities", description: "Internet, power, water, mobile plans, and other recurring essentials." },
];

const About = () => {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <section className="rounded-lg border bg-card px-6 py-8 shadow-sm md:px-8 md:py-10">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground">
            <MapPinned className="h-4 w-4 text-primary" />
            Bengaluru Cost Explorer
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            About the Project
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Bengaluru Cost Explorer is a student-built guide for understanding everyday living expenses across the city. It brings together neighborhood-level cost data so residents, newcomers, and businesses can compare options with more confidence.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-primary" />
              Built By Students
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            The project was created by Computer Science and Business Systems students from KS School of Engineering and Management.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-5 w-5 text-primary" />
              Crowdsourced Data
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            Contributions help keep prices practical and current, from rent and food to transport and utilities.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-5 w-5 text-primary" />
              Local Decisions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            The goal is simple: make city costs easier to scan, compare, and plan around.
          </CardContent>
        </Card>
      </section>

      <section className="rounded-lg border bg-card p-6 shadow-sm md:p-8">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">What We Track</h2>
          <p className="mt-2 text-muted-foreground">
            The platform focuses on common cost categories that affect day-to-day life in Bengaluru.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {focusAreas.map((area) => (
            <div key={area.label} className="rounded-md border bg-background p-4">
              <h3 className="font-semibold">{area.label}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{area.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
