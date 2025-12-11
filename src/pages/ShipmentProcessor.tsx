import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ApiError } from "@/components/ui/api-error";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecommendationsList } from "@/components/dashboard/RecommendationsList";
import {
  processShipmentEmissions,
  ShipmentEmissionsResponse,
} from "@/lib/api";
import {
  Truck,
  Fuel,
  Route,
  CloudRain,
  TreeDeciduous,
  Gauge,
  Send,
} from "lucide-react";
import { toast } from "sonner";

export default function ShipmentProcessor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShipmentEmissionsResponse | null>(null);

  const [formData, setFormData] = useState({
    shipmentId: "",
    origin: "",
    destination: "",
    cargoWeight: "",
    transportMode: "",
    fuelType: "",
    distance: "",
    additionalNotes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await processShipmentEmissions(
        {
          shipment_id: formData.shipmentId || `SHIP${Date.now()}`,
          origin: formData.origin,
          destination: formData.destination,
          cargo_weight_kg: parseFloat(formData.cargoWeight) || 0,
        },
        {
          transport_mode: formData.transportMode,
          fuel_type: formData.fuelType,
          distance_km: parseFloat(formData.distance) || 0,
        },
        {
          notes: formData.additionalNotes,
        }
      );

      if (response.success && response.response) {
        setResult(response.response);
        toast.success("Shipment emissions processed successfully!");
      } else {
        throw new Error(response.error || "Failed to process emissions");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast.error("Failed to process shipment");
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
            Shipment Emissions Processor
          </h1>
          <p className="mt-2 text-muted-foreground">
            Calculate and analyze emissions for individual shipments
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border bg-card p-6 shadow-sm"
            >
              <h2 className="text-lg font-display font-semibold">
                Shipment Details
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter shipment information to calculate emissions
              </p>

              <div className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="shipmentId">Shipment ID</Label>
                    <Input
                      id="shipmentId"
                      placeholder="SHIP123456"
                      value={formData.shipmentId}
                      onChange={(e) =>
                        setFormData({ ...formData, shipmentId: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargoWeight">Cargo Weight (kg)</Label>
                    <Input
                      id="cargoWeight"
                      type="number"
                      placeholder="4000"
                      value={formData.cargoWeight}
                      onChange={(e) =>
                        setFormData({ ...formData, cargoWeight: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origin</Label>
                    <Input
                      id="origin"
                      placeholder="New York, NY"
                      value={formData.origin}
                      onChange={(e) =>
                        setFormData({ ...formData, origin: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      placeholder="Los Angeles, CA"
                      value={formData.destination}
                      onChange={(e) =>
                        setFormData({ ...formData, destination: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="transportMode">Truck Type</Label>
                    <Select
                      value={formData.transportMode}
                      onValueChange={(value) =>
                        setFormData({ ...formData, transportMode: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select truck type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light_duty_truck">Light Duty Truck</SelectItem>
                        <SelectItem value="medium_duty_truck">Medium Duty Truck</SelectItem>
                        <SelectItem value="heavy_duty_truck">Heavy Duty Truck</SelectItem>
                        <SelectItem value="semi_truck">Semi Truck</SelectItem>
                        <SelectItem value="box_truck">Box Truck</SelectItem>
                        <SelectItem value="delivery_van">Delivery Van</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select
                      value={formData.fuelType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, fuelType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="gasoline">Gasoline</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="lng">LNG</SelectItem>
                        <SelectItem value="biofuel">Biofuel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    placeholder="800"
                    value={formData.distance}
                    onChange={(e) =>
                      setFormData({ ...formData, distance: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="Any additional details about the shipment..."
                    value={formData.additionalNotes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additionalNotes: e.target.value,
                      })
                    }
                    rows={3}
                  />
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
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Calculate Emissions
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
            className="space-y-6"
          >
            {error && <ApiError error={error} onRetry={handleRetry} />}

            {loading && (
              <div className="flex h-64 items-center justify-center rounded-xl border bg-card">
                <div className="text-center">
                  <LoadingSpinner size="lg" className="mx-auto" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Processing shipment data...
                  </p>
                </div>
              </div>
            )}

            {result && !loading && (
              <>
                {/* Metrics */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <MetricCard
                    title="Total CO₂"
                    value={result.total_co2_kg}
                    unit="kg"
                    icon={<CloudRain className="h-5 w-5" />}
                    variant="primary"
                  />
                  <MetricCard
                    title="Carbon Trees"
                    value={result.environmental_impact?.carbon_equivalent_trees || 0}
                    icon={<TreeDeciduous className="h-5 w-5" />}
                    variant="success"
                  />
                </div>

                {/* Breakdown */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <h3 className="text-lg font-display font-semibold">
                    Emission Breakdown
                  </h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                      <Truck className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Truck Type</p>
                        <p className="font-medium capitalize">
                          {result.emission_breakdown?.truck_type?.replace(/_/g, " ") || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                      <Route className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Distance</p>
                        <p className="font-medium">
                          {result.emission_breakdown?.distance_km?.toLocaleString() ||
                            "N/A"}{" "}
                          km
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                      <Fuel className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Fuel Used</p>
                        <p className="font-medium">
                          {result.emission_breakdown?.fuel_consumption_liters?.toLocaleString() ||
                            "N/A"}{" "}
                          L
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trucking Analysis */}
                {result.trucking_analysis && (
                  <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-display font-semibold">
                      Trucking Analysis
                    </h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-xs text-muted-foreground">Optimal Truck</p>
                        <p className="font-medium capitalize">
                          {result.trucking_analysis.optimal_truck_type?.replace(/_/g, " ") || "N/A"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-xs text-muted-foreground">Load Efficiency</p>
                        <p className="font-medium">
                          {result.trucking_analysis.load_efficiency}%
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-xs text-muted-foreground">Route Optimization</p>
                        <p className="font-medium text-sm">
                          {result.trucking_analysis.route_optimization_potential || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Efficiency */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <h3 className="text-lg font-display font-semibold">
                    Efficiency Metrics
                  </h3>
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
                      <Gauge className="h-4 w-4 text-secondary-foreground" />
                      <span className="text-sm font-medium">
                        {result.efficiency_metrics?.co2_per_kg_cargo} kg CO₂/kg cargo
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
                      <span className="text-sm font-medium">
                        Rating: {result.efficiency_metrics?.fuel_efficiency_rating}
                      </span>
                    </div>
                    {result.efficiency_metrics?.trucking_efficiency_score !== undefined && (
                      <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                        <span className="text-sm font-medium text-primary">
                          Efficiency Score: {result.efficiency_metrics.trucking_efficiency_score}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {result.summary && (
                  <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-display font-semibold">Summary</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {result.summary}
                    </p>
                  </div>
                )}

                {/* Recommendations */}
                <RecommendationsList
                  recommendations={
                    result.environmental_impact?.trucking_recommendations || []
                  }
                  title="Trucking Recommendations"
                />
              </>
            )}

            {!result && !loading && !error && (
              <div className="flex h-64 items-center justify-center rounded-xl border border-dashed bg-muted/30">
                <div className="text-center">
                  <Truck className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Enter shipment details to calculate emissions
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