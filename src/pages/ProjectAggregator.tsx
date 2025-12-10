import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ApiError } from "@/components/ui/api-error";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { EmissionsChart } from "@/components/dashboard/EmissionsChart";
import { RecommendationsList } from "@/components/dashboard/RecommendationsList";
import {
  aggregateProjectEmissions,
  ProjectEmissionsResponse,
} from "@/lib/api";
import {
  FolderKanban,
  Building2,
  Calendar,
  CloudRain,
  TrendingDown,
  DollarSign,
  Send,
  Package,
} from "lucide-react";
import { toast } from "sonner";

export default function ProjectAggregator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProjectEmissionsResponse | null>(null);

  const [formData, setFormData] = useState({
    projectId: "",
    projectName: "",
    clientName: "",
    clientIndustry: "",
    startDate: "",
    endDate: "",
    shipmentData: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let shipmentEmissionsArray = [];
      if (formData.shipmentData) {
        try {
          shipmentEmissionsArray = JSON.parse(formData.shipmentData);
        } catch {
          // If parsing fails, treat as sample data request
          shipmentEmissionsArray = [
            { shipment_id: "SHIP001", total_co2_kg: 1520, mode: "truck" },
            { shipment_id: "SHIP002", total_co2_kg: 3200, mode: "air" },
            { shipment_id: "SHIP003", total_co2_kg: 800, mode: "rail" },
          ];
        }
      }

      const response = await aggregateProjectEmissions(
        {
          project_id: formData.projectId || `PROJ${Date.now()}`,
          project_name: formData.projectName,
          date_range: {
            start_date: formData.startDate,
            end_date: formData.endDate,
          },
        },
        {
          client_name: formData.clientName,
          industry: formData.clientIndustry,
        },
        shipmentEmissionsArray
      );

      if (response.success && response.response) {
        setResult(response.response);
        toast.success("Project emissions aggregated successfully!");
      } else {
        throw new Error(response.error || "Failed to aggregate emissions");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast.error("Failed to aggregate project emissions");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    handleSubmit(new Event("submit") as unknown as React.FormEvent);
  };

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
            Project Emissions Aggregator
          </h1>
          <p className="mt-2 text-muted-foreground">
            Aggregate shipment emissions into project-level summaries
          </p>
        </motion.div>

        <div className="grid gap-8 xl:grid-cols-5">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="xl:col-span-2"
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border bg-card p-6 shadow-sm"
            >
              <h2 className="text-lg font-display font-semibold">
                Project Information
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter project and client details
              </p>

              <div className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="projectId">Project ID</Label>
                    <Input
                      id="projectId"
                      placeholder="PROJ-2024-001"
                      value={formData.projectId}
                      onChange={(e) =>
                        setFormData({ ...formData, projectId: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      placeholder="Q4 Logistics Initiative"
                      value={formData.projectName}
                      onChange={(e) =>
                        setFormData({ ...formData, projectName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      placeholder="Acme Corporation"
                      value={formData.clientName}
                      onChange={(e) =>
                        setFormData({ ...formData, clientName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientIndustry">Industry</Label>
                    <Input
                      id="clientIndustry"
                      placeholder="Retail"
                      value={formData.clientIndustry}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          clientIndustry: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipmentData">
                    Shipment Emissions Data (JSON)
                  </Label>
                  <Textarea
                    id="shipmentData"
                    placeholder='[{"shipment_id": "SHIP001", "total_co2_kg": 1520, "mode": "truck"}]'
                    value={formData.shipmentData}
                    onChange={(e) =>
                      setFormData({ ...formData, shipmentData: e.target.value })
                    }
                    rows={4}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use sample data
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Aggregating...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Aggregate Emissions
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-6 xl:col-span-3"
          >
            {error && <ApiError error={error} onRetry={handleRetry} />}

            {loading && (
              <div className="flex h-64 items-center justify-center rounded-xl border bg-card">
                <div className="text-center">
                  <LoadingSpinner size="lg" className="mx-auto" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Aggregating project emissions...
                  </p>
                </div>
              </div>
            )}

            {result && !loading && (
              <>
                {/* Project Info */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <FolderKanban className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-semibold">
                        {result.client_name || "Project Report"}
                      </h2>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        {result.project_id && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {result.project_id}
                          </span>
                        )}
                        {result.date_range?.start_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {result.date_range.start_date} -{" "}
                            {result.date_range.end_date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard
                    title="Total CO₂"
                    value={result.total_project_co2_kg || 0}
                    unit="kg"
                    icon={<CloudRain className="h-5 w-5" />}
                    variant="primary"
                  />
                  <MetricCard
                    title="Shipments"
                    value={result.shipment_count || 0}
                    icon={<Package className="h-5 w-5" />}
                  />
                  <MetricCard
                    title="Improvement Potential"
                    value={
                      result.efficiency_analysis?.improvement_potential_percent || 0
                    }
                    unit="%"
                    icon={<TrendingDown className="h-5 w-5" />}
                    variant="success"
                  />
                  <MetricCard
                    title="Potential Savings"
                    value={`$${(
                      result.cost_analysis?.potential_savings || 0
                    ).toLocaleString()}`}
                    icon={<DollarSign className="h-5 w-5" />}
                    variant="warning"
                  />
                </div>

                {/* Chart */}
                {result.emissions_by_mode && (
                  <EmissionsChart data={result.emissions_by_mode} />
                )}

                {/* Sustainability Metrics */}
                {result.sustainability_metrics && (
                  <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-display font-semibold">
                      Sustainability Metrics
                    </h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-xs text-muted-foreground">
                          Project Score
                        </p>
                        <p className="mt-1 text-2xl font-bold text-primary">
                          {result.sustainability_metrics.project_score || "N/A"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-xs text-muted-foreground">
                          Carbon Intensity
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                          {result.sustainability_metrics.carbon_intensity || 0}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-xs text-muted-foreground">
                          Benchmark
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {result.sustainability_metrics.benchmark_comparison ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <RecommendationsList
                  recommendations={result.recommendations || []}
                  title="Project Recommendations"
                />
              </>
            )}

            {!result && !loading && !error && (
              <div className="flex h-64 items-center justify-center rounded-xl border border-dashed bg-muted/30">
                <div className="text-center">
                  <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Enter project details to aggregate emissions
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}