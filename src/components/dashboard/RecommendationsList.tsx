import { motion } from "framer-motion";
import { Lightbulb, ArrowRight } from "lucide-react";

interface RecommendationsListProps {
  recommendations: string[];
  title?: string;
}

export function RecommendationsList({
  recommendations,
  title = "Recommendations",
}: RecommendationsListProps) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-xl border bg-card p-6 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
          <Lightbulb className="h-4 w-4 text-accent-foreground" />
        </div>
        <h3 className="text-lg font-display font-semibold">{title}</h3>
      </div>

      <ul className="mt-4 space-y-3">
        {recommendations.map((recommendation, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="flex items-start gap-3 rounded-lg bg-muted/50 p-3 text-sm"
          >
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="text-foreground/90">{recommendation}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}