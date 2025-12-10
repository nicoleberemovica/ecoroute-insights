import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface EmissionsChartProps {
  data: {
    air: number;
    ground: number;
    sea: number;
    rail: number;
  };
}

const COLORS = {
  air: "hsl(200, 80%, 55%)",
  ground: "hsl(160, 60%, 40%)",
  sea: "hsl(210, 70%, 50%)",
  rail: "hsl(280, 50%, 55%)",
};

export function EmissionsChart({ data }: EmissionsChartProps) {
  const chartData = [
    { name: "Air", value: data.air, color: COLORS.air },
    { name: "Ground", value: data.ground, color: COLORS.ground },
    { name: "Sea", value: data.sea, color: COLORS.sea },
    { name: "Rail", value: data.rail, color: COLORS.rail },
  ].filter((item) => item.value > 0);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border bg-card p-6 shadow-sm"
    >
      <h3 className="text-lg font-display font-semibold">Emissions by Mode</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Distribution across transport methods
      </p>

      <div className="mt-6 h-64">
        {total > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    strokeWidth={0}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `${value.toLocaleString()} kg CO₂`,
                  "Emissions",
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "var(--shadow-md)",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">No emissions data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}