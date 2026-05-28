import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCostData, CostItem } from "@/lib/mock-data";
import { Loader2, Swords, Trophy, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "Housing", "Food", "Transportation", "Utilities",
  "Entertainment", "Healthcare", "Education", "Fitness & Lifestyle"
];

export default function AreaBattle() {
  const [data, setData] = useState<CostItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [area1, setArea1] = useState<string>("");
  const [area2, setArea2] = useState<string>("");
  const [battleActive, setBattleActive] = useState(false);

  useEffect(() => {
    fetchCostData().then(fetched => {
      setData(fetched);
      const uniqueAreas = [...new Set(fetched.map(item => item.area))].filter(a => a !== "All Areas");
      if (uniqueAreas.length >= 2) {
        setArea1(uniqueAreas[0]);
        setArea2(uniqueAreas[1]);
      }
      setLoading(false);
    });
  }, []);

  const uniqueAreas = useMemo(() => {
    return [...new Set(data.map(item => item.area))].filter(a => a !== "All Areas");
  }, [data]);

  const battleStats = useMemo(() => {
    if (!battleActive || !area1 || !area2) return null;
    
    let area1Wins = 0;
    let area2Wins = 0;
    const categoryResults = CATEGORIES.map(category => {
      const a1Items = data.filter(d => (d.area === area1 || d.area === "All Areas") && d.category === category);
      const a2Items = data.filter(d => (d.area === area2 || d.area === "All Areas") && d.category === category);
      
      const a1Avg = a1Items.length > 0 ? a1Items.reduce((acc, curr) => acc + curr.avg_price, 0) / a1Items.length : 0;
      const a2Avg = a2Items.length > 0 ? a2Items.reduce((acc, curr) => acc + curr.avg_price, 0) / a2Items.length : 0;

      let winner = 0; // 0 = tie/none, 1 = area1, 2 = area2
      if (a1Avg > 0 && a2Avg > 0) {
        if (a1Avg < a2Avg) { winner = 1; area1Wins++; }
        else if (a2Avg < a1Avg) { winner = 2; area2Wins++; }
      }

      return { category, a1Avg, a2Avg, winner };
    });

    let overallWinner = 0;
    if (area1Wins > area2Wins) overallWinner = 1;
    else if (area2Wins > area1Wins) overallWinner = 2;

    return { categoryResults, area1Wins, area2Wins, overallWinner };
  }, [battleActive, area1, area2, data]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center flex-col gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading arena data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          <Swords className="w-10 h-10 text-primary" /> Area Battle
        </h1>
        <p className="text-muted-foreground">Pit two neighborhoods against each other to see which is more affordable.</p>
      </div>

      {/* Selectors */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex-1 w-full space-y-2">
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Corner 1 (Blue)</label>
          <Select value={area1} onValueChange={(val) => { setArea1(val); setBattleActive(false); }}>
            <SelectTrigger className="w-full h-12 text-lg font-bold border-blue-500/30 focus:ring-blue-500">
              <SelectValue placeholder="Select Area 1" />
            </SelectTrigger>
            <SelectContent>
              {uniqueAreas.map(area => (
                <SelectItem key={area} value={area} disabled={area === area2}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={() => setBattleActive(true)}
          disabled={!area1 || !area2 || battleActive}
          className="h-16 px-8 rounded-full text-lg font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Swords className="w-6 h-6 mr-2" /> BATTLE!
        </Button>

        <div className="flex-1 w-full space-y-2">
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-right block">Corner 2 (Red)</label>
          <Select value={area2} onValueChange={(val) => { setArea2(val); setBattleActive(false); }}>
            <SelectTrigger className="w-full h-12 text-lg font-bold border-red-500/30 focus:ring-red-500 text-right">
              <SelectValue placeholder="Select Area 2" />
            </SelectTrigger>
            <SelectContent>
              {uniqueAreas.map(area => (
                <SelectItem key={area} value={area} disabled={area === area1}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Battle Arena */}
      <AnimatePresence>
        {battleActive && battleStats && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Scoreboard */}
            <div className="flex justify-center items-center gap-8 text-3xl font-black bg-background border py-4 rounded-xl shadow-sm">
              <div className="text-blue-500 text-right min-w-[150px]">{area1} <br/> <span className="text-5xl">{battleStats.area1Wins}</span></div>
              <div className="text-muted-foreground text-xl px-4">VS</div>
              <div className="text-red-500 text-left min-w-[150px]">{area2} <br/> <span className="text-5xl">{battleStats.area2Wins}</span></div>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {battleStats.categoryResults.map((result, i) => (
                <motion.div 
                  key={result.category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border rounded-xl p-5 shadow-sm relative overflow-hidden"
                >
                  <h3 className="text-center font-bold text-muted-foreground uppercase tracking-wider text-sm mb-4">{result.category}</h3>
                  <div className="flex justify-between items-center relative z-10">
                    <div className={`text-center flex-1 ${result.winner === 1 ? 'text-green-500 font-bold scale-110' : 'text-foreground'}`}>
                      <div className="text-2xl">₹{result.a1Avg > 0 ? Math.round(result.a1Avg).toLocaleString() : 'N/A'}</div>
                      {result.winner === 1 && <span className="text-xs bg-green-500/10 px-2 py-1 rounded-full uppercase mt-1 inline-block">Winner ✅</span>}
                    </div>
                    <div className="text-muted-foreground px-4"><ChevronRight className="w-5 h-5 opacity-30" /></div>
                    <div className={`text-center flex-1 ${result.winner === 2 ? 'text-green-500 font-bold scale-110' : 'text-foreground'}`}>
                      <div className="text-2xl">₹{result.a2Avg > 0 ? Math.round(result.a2Avg).toLocaleString() : 'N/A'}</div>
                      {result.winner === 2 && <span className="text-xs bg-green-500/10 px-2 py-1 rounded-full uppercase mt-1 inline-block">Winner ✅</span>}
                    </div>
                  </div>
                  {/* Background winning gradient */}
                  {result.winner === 1 && <div className="absolute left-0 top-0 w-1/2 h-full bg-blue-500/5 -z-10" />}
                  {result.winner === 2 && <div className="absolute right-0 top-0 w-1/2 h-full bg-red-500/5 -z-10" />}
                </motion.div>
              ))}
            </div>

            {/* Winner Banner */}
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, type: "spring" }}
              className={`p-8 rounded-2xl border-2 text-center shadow-2xl relative overflow-hidden ${
                battleStats.overallWinner === 1 ? 'bg-blue-500/10 border-blue-500/50' : 
                battleStats.overallWinner === 2 ? 'bg-red-500/10 border-red-500/50' : 'bg-muted border-border'
              }`}
            >
              <Trophy className={`w-16 h-16 mx-auto mb-4 ${
                battleStats.overallWinner === 1 ? 'text-blue-500' : 
                battleStats.overallWinner === 2 ? 'text-red-500' : 'text-muted-foreground'
              }`} />
              <h2 className="text-3xl font-black mb-2">
                {battleStats.overallWinner === 1 ? `${area1} Wins!` : 
                 battleStats.overallWinner === 2 ? `${area2} Wins!` : "It's a Tie!"}
              </h2>
              <p className="text-muted-foreground">Overall, {battleStats.overallWinner === 1 ? area1 : battleStats.overallWinner === 2 ? area2 : "neither"} is more affordable across the board.</p>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
