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
import {
  generateExecutiveSummary,
  ExecutiveSummaryResponse,
} from "@/lib/api";
import {
  FileText,
  AlertTriangle,
  TrendingUp,
  Target,
  Calendar,
  Send,
  CheckCircle,
  XCircle,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

export default function ExecutiveSummary() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExecutiveSummaryResponse | null>(null);

  const [formData, setFormData] = useState({
    businessContext: "",
    aggregatedEmissions: "",
    sustainabilityGoals: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await generateExecutiveSummary(
        formData.businessContext || "logistics",
        formData.aggregatedEmissions || "5000t CO2e",
        formData.sustainabilityGoals || "net zero 2030"
      );

      if (response.success && response.response) {
        setResult(response.response);
        toast.success("Executive summary generated successfully!");
      } else {
        throw new Error(response.error || "Failed to generate summary");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast.error("Failed to generate executive summary");
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
            Executive Summary Generator
          </h1>
          <p className="mt-2 text-muted-foreground">
            Generate executive-level reports for CEO and sustainability leadership
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
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
                Report Parameters
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Configure the executive summary
              </p>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessContext">Business Context</Label>
                  <Select
                    value={formData.businessContext}
                    onValueChange={(value) =>
                      setFormData({ ...formData, businessContext: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="logistics">Logistics</SelectItem>
                      <SelectItem value="ecommerce">E-Commerce</SelectItem>
                      <SelectItem value="fmcg">FMCG</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aggregatedEmissions">
                    Aggregated Emissions
                  </Label>
                  <Input
                    id="aggregatedEmissions"
                    placeholder="5000t CO2e"
                    value={formData.aggregatedEmissions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        aggregatedEmissions: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Total emissions to analyze
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sustainabilityGoals">
                    Sustainability Goals
                  </Label>
                  <Textarea
                    id="sustainabilityGoals"
                    placeholder="net zero 2030, 50% reduction by 2025"
                    value={formData.sustainabilityGoals}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sustainabilityGoals: e.target.value,
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
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Generate Summary
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
            className="space-y-6 lg:col-span-2"
          >
            {error && <ApiError error={error} onRetry={handleRetry} />}

            {loading && (
              <div className="flex h-64 items-center justify-center rounded-xl border bg-card">
                <div className="text-center">
                  <LoadingSpinner size="lg" className="mx-auto" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Generating executive summary...
                  </p>
                </div>
              </div>
            )}

            {result && !loading && (
              <>
                {/* Headline */}
                <div className="rounded-xl border bg-gradient-to-br from-primary/5 via-card to-accent/5 p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-display font-semibold">
                        Executive Summary
                      </h2>
                      <p className="mt-2 text-muted-foreground leading-relaxed">
                        {result.executive_summary?.headline_metric}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dashboard Metrics */}
                {result.dashboard_metrics && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                      <p className="text-xs font-medium text-muted-foreground">
                        Total Emissions
                      </p>
                      <p className="mt-1 text-2xl font-bold text-primary">
                        {result.dashboard_metrics.total_emissions?.toLocaleString()}t
                      </p>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                      <p className="text-xs font-medium text-muted-foreground">
                        Reduction Opportunity
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {result.dashboard_metrics.reduction_opportunity}
                      </p>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                      <p className="text-xs font-medium text-muted-foreground">
                        Compliance Status
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium">
                          {result.dashboard_metrics.compliance_status}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                      <p className="text-xs font-medium text-muted-foreground">
                        Next Review
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {result.dashboard_metrics.next_review_date}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Key Findings */}
                {result.executive_summary?.key_findings && (
                  <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-display font-semibold">
                        Key Findings
                      </h3>
                    </div>
                    <ul className="mt-4 space-y-3">
                      {result.executive_summary.key_findings.map(
                        (finding, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 text-sm"
                          >
                            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>{finding}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* Business Impact */}
                {result.executive_summary?.business_impact && (
                  <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                      <h3 className="text-lg font-display font-semibold">
                        Business Impact
                      </h3>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-lg bg-destructive/5 p-4">
                        <p className="text-xs font-medium text-muted-foreground">
                          Risk Level
                        </p>
                        <p className="mt-1 text-sm font-medium text-destructive">
                          {result.executive_summary.business_impact.risk_level}
                        </p>
                      </div>
                      <div className="rounded-lg bg-warning/5 p-4">
                        <p className="text-xs font-medium text-muted-foreground">
                          Cost Implications
                        </p>
                        <p className="mt-1 text-sm">
                          {
                            result.executive_summary.business_impact
                              .cost_implications
                          }
                        </p>
                      </div>
                      <div className="rounded-lg bg-info/5 p-4">
                        <p className="text-xs font-medium text-muted-foreground">
                          Competitive Position
                        </p>
                        <p className="mt-1 text-sm">
                          {
                            result.executive_summary.business_impact
                              .competitive_position
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Strategic Recommendations */}
                {result.executive_summary?.strategic_recommendations && (
                  <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-display font-semibold">
                        Strategic Recommendations
                      </h3>
                    </div>

                    <div className="mt-4 grid gap-6 lg:grid-cols-2">
                      {/* Immediate Actions */}
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold">
                          <XCircle className="h-4 w-4 text-destructive" />
                          Immediate Actions
                        </h4>
                        <ul className="mt-3 space-y-2">
                          {result.executive_summary.strategic_recommendations.immediate_actions?.map(
                            (action, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                                {action}
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      {/* Long-term Strategy */}
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold">
                          <TrendingUp className="h-4 w-4 text-success" />
                          Long-term Strategy
                        </h4>
                        <ul className="mt-3 space-y-2">
                          {result.executive_summary.strategic_recommendations.long_term_strategy?.map(
                            (strategy, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                                {strategy}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>

                    {result.executive_summary.strategic_recommendations
                      .investment_needed && (
                      <div className="mt-6 rounded-lg bg-accent/10 p-4">
                        <p className="text-sm font-medium">
                          Investment Required:{" "}
                          <span className="text-muted-foreground">
                            {
                              result.executive_summary.strategic_recommendations
                                .investment_needed
                            }
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Performance Indicators */}
                {result.executive_summary?.performance_indicators && (
                  <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-display font-semibold">
                      Performance Indicators
                    </h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          Emissions Trend
                        </p>
                        <p className="text-sm">
                          {
                            result.executive_summary.performance_indicators
                              .emissions_trend
                          }
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          Efficiency Improvement
                        </p>
                        <p className="text-sm">
                          {
                            result.executive_summary.performance_indicators
                              .efficiency_improvement
                          }
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          Goal Progress
                        </p>
                        <p className="text-sm">
                          {
                            result.executive_summary.performance_indicators
                              .goal_progress
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {!result && !loading && !error && (
              <div className="flex h-64 items-center justify-center rounded-xl border border-dashed bg-muted/30">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Configure parameters to generate an executive summary
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