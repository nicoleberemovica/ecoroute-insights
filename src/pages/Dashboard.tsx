import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { EmissionsChart } from "@/components/dashboard/EmissionsChart";
import { RecommendationsList } from "@/components/dashboard/RecommendationsList";
import { Button } from "@/components/ui/button";
import {
  CloudRain,
  Truck,
  TrendingDown,
  Target,
  ArrowRight,
  Leaf,
} from "lucide-react";
import { Link } from "react-router-dom";

const mockData = {
  totalEmissions: 15200,
  shipmentsProcessed: 47,
  avgEfficiency: 0.38,
  reductionTarget: 25,
  emissionsByMode: {
    air: 4500,
    ground: 6200,
    sea: 3500,
    rail: 1000,
  },
  recommendations: [
    "Optimize route planning to reduce distance traveled by 15%",
    "Shift 30% of air freight to sea transport for non-urgent shipments",
    "Implement eco-driving training programs for all drivers",
    "Consider consolidating shipments to improve load factors",
  ],
};

export default function Dashboard() {
  const [data] = useState(mockData);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold tracking-tight lg:text-4xl">
            Emissions Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track and monitor your logistics carbon footprint in real-time
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total CO₂ Emissions"
            value={data.totalEmissions}
            unit="kg"
            change={-8}
            changeLabel="vs last month"
            icon={<CloudRain className="h-6 w-6" />}
            variant="primary"
            delay={0}
          />
          <MetricCard
            title="Shipments Processed"
            value={data.shipmentsProcessed}
            change={12}
            changeLabel="vs last month"
            icon={<Truck className="h-6 w-6" />}
            delay={0.1}
          />
          <MetricCard
            title="Avg CO₂ per kg"
            value={data.avgEfficiency}
            unit="kg"
            change={-5}
            changeLabel="improvement"
            icon={<TrendingDown className="h-6 w-6" />}
            variant="success"
            delay={0.2}
          />
          <MetricCard
            title="Reduction Target"
            value={data.reductionTarget}
            unit="%"
            icon={<Target className="h-6 w-6" />}
            variant="warning"
            delay={0.3}
          />
        </div>

        {/* Charts and Recommendations */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <EmissionsChart data={data.emissionsByMode} />
          <RecommendationsList recommendations={data.recommendations} />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8 rounded-xl border bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-6"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Leaf className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-display font-semibold">
                  Start Tracking Emissions
                </h3>
                <p className="text-sm text-muted-foreground">
                  Process shipment data or generate executive reports
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/shipment">
                  Process Shipment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/executive">Generate Report</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}