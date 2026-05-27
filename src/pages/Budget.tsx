import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  salary: z.string().min(1, "Please enter your salary").transform(val => Number(val)),
  persona: z.enum(["student", "professional"]),
});

type Breakdown = {
  name: string;
  value: number;
  color: string;
}[];

const Budget = () => {
  const [breakdown, setBreakdown] = useState<Breakdown | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salary: 0 as any,
      persona: "professional",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const salary = values.salary;
    let data: Breakdown = [];
    
    if (values.persona === "student") {
      data = [
        { name: "Rent & Utilities", value: salary * 0.4, color: "#f59e0b" },
        { name: "Food & Groceries", value: salary * 0.35, color: "#3b82f6" },
        { name: "Transport", value: salary * 0.1, color: "#10b981" },
        { name: "Misc / Fun", value: salary * 0.15, color: "#8b5cf6" },
      ];
    } else {
      data = [
        { name: "Rent & Utilities", value: salary * 0.3, color: "#f59e0b" },
        { name: "Food & Groceries", value: salary * 0.2, color: "#3b82f6" },
        { name: "Transport", value: salary * 0.1, color: "#10b981" },
        { name: "Investments/Savings", value: salary * 0.3, color: "#8b5cf6" },
        { name: "Misc / Fun", value: salary * 0.1, color: "#ef4444" },
      ];
    }
    setBreakdown(data);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground">Budget Calculator</h1>
        <p className="text-muted-foreground">Plan your expenses based on your salary and lifestyle.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
              <CardDescription>Enter your monthly income to get a suggested breakdown.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Budget / Salary (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 50000" {...field} className="bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="persona"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lifestyle</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select persona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="student">Student / Fresher</SelectItem>
                            <SelectItem value="professional">Working Professional</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Calculate Budget</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card border-border/50 h-full">
            <CardHeader>
              <CardTitle>Suggested Breakdown</CardTitle>
              <CardDescription>
                {breakdown ? "Based on 50/30/20 and local Bengaluru trends." : "Fill the form to see your breakdown."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[300px]">
              {breakdown ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={breakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {breakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        formatter={(value: number) => [`₹${value.toLocaleString()}`, undefined]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm italic">No data yet</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Budget;
