const API_BASE = "https://agent.kith.build/prompt";
const AUTH_TOKEN = "sk-qduCZ0d7ZK8WdXiwq4QzF1us6PDrTLvqLvqL-tVM5PA";

interface ApiResponse<T> {
  success: boolean;
  response: T;
  error?: string;
  agent_name: string;
  prompt_name: string;
  prompt_id: string;
}

const normalizeResponseField = <T>(responseField: T | string): T => {
  if (typeof responseField === "string") {
    try {
      return JSON.parse(responseField);
    } catch {
      return responseField as T;
    }
  }
  return responseField;
};

async function makeRequest<T>(
  promptId: string,
  agentUuid: string,
  variables: Record<string, string>
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE}/${promptId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${AUTH_TOKEN}`,
    },
    body: JSON.stringify({
      agent_uuid: agentUuid,
      variables,
    }),
  });

  if (response.status === 402) {
    throw new Error("API_LIMIT_EXCEEDED");
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    ...data,
    response: normalizeResponseField(data.response),
  };
}

// Shipment Emissions Processor
export interface ShipmentEmissionsResponse {
  shipment_id: string;
  total_co2_kg: number;
  calculation_details?: {
    formula: string;
    step_by_step_calculation?: {
      original_weight: string;
      original_distance: string;
      converted_weight_kg: number;
      converted_distance_km: number;
      emission_factor_kg_per_km: number;
      calculation_steps: string[];
    };
    emission_factor_source: string;
    units_detected: string;
    conversion_applied: boolean;
  };
  emission_breakdown: {
    truck_type: string;
    fuel_consumption_liters: number;
    distance_km: number;
    emission_factor_kg_per_km: number;
    emission_factor_source?: string;
  };
  efficiency_metrics: {
    co2_per_kg_cargo: number;
    co2_per_km: number;
    fuel_efficiency_rating: string;
    trucking_efficiency_score: number;
    calculation_sources?: {
      co2_per_kg_cargo: string;
      co2_per_km: string;
      fuel_efficiency_rating: string;
      efficiency_score_basis: string;
    };
  };
  environmental_impact: {
    impact_level: string;
    carbon_equivalent_trees: number;
    trees_calculation_source?: string;
    trucking_recommendations: string[];
  };
  trucking_analysis?: {
    optimal_truck_type: string;
    load_efficiency: number;
    route_optimization_potential: string;
  };
  unit_conversion_log?: {
    input_units: string;
    conversions_performed: string[];
  };
  summary: string;
}

export async function processShipmentEmissions(
  shipmentData: Record<string, unknown>,
  transportDetails: Record<string, unknown>,
  calculatedEmissions: Record<string, unknown>
): Promise<ApiResponse<ShipmentEmissionsResponse>> {
  return makeRequest<ShipmentEmissionsResponse>(
    "75bc1378-1652-459d-b862-183e3c84b7ca",
    "dad0d485-cec9-40f6-81a6-3089fd3894e5",
    {
      shipment_data: JSON.stringify(shipmentData),
      transport_details: JSON.stringify(transportDetails),
      calculated_emissions: JSON.stringify(calculatedEmissions),
    }
  );
}

// Project Emissions Aggregator
export interface ProjectEmissionsResponse {
  project_id: string;
  client_name: string;
  total_project_co2_kg: number;
  shipment_count: number;
  date_range: {
    start_date: string;
    end_date: string;
  };
  emissions_by_mode: {
    air: number;
    ground: number;
    sea: number;
    rail: number;
  };
  efficiency_analysis: {
    average_co2_per_shipment: number;
    most_efficient_shipment: string;
    least_efficient_shipment: string;
    improvement_potential_percent: number;
  };
  sustainability_metrics: {
    project_score: string;
    carbon_intensity: number;
    benchmark_comparison: string;
  };
  recommendations: string[];
  cost_analysis: {
    estimated_carbon_cost: number;
    potential_savings: number;
  };
}

export async function aggregateProjectEmissions(
  projectInfo: Record<string, unknown>,
  clientDetails: Record<string, unknown>,
  shipmentEmissionsArray: Record<string, unknown>[]
): Promise<ApiResponse<ProjectEmissionsResponse>> {
  return makeRequest<ProjectEmissionsResponse>(
    "c76a1e14-7e8e-477a-bc4b-1b74800f87ea",
    "f5a05b67-e892-49cd-97da-ddef522ba07e",
    {
      project_info: JSON.stringify(projectInfo),
      client_details: JSON.stringify(clientDetails),
      shipment_emissions_array: JSON.stringify(shipmentEmissionsArray),
    }
  );
}

// Executive Summary
export interface ExecutiveSummaryResponse {
  executive_summary: {
    headline_metric: string;
    key_findings: string[];
    business_impact: {
      risk_level: string;
      cost_implications: string;
      competitive_position: string;
    };
    strategic_recommendations: {
      immediate_actions: string[];
      long_term_strategy: string[];
      investment_needed: string;
    };
    performance_indicators: {
      emissions_trend: string;
      efficiency_improvement: string;
      goal_progress: string;
    };
  };
  dashboard_metrics: {
    total_emissions: number;
    reduction_opportunity: string;
    compliance_status: string;
    next_review_date: string;
  };
}

export async function generateExecutiveSummary(
  businessContext: string,
  aggregatedEmissions: string,
  sustainabilityGoals: string
): Promise<ApiResponse<ExecutiveSummaryResponse>> {
  return makeRequest<ExecutiveSummaryResponse>(
    "d9ebf668-3742-491d-b74c-5ec741d0716e",
    "f5a05b67-e892-49cd-97da-ddef522ba07e",
    {
      business_context: businessContext,
      aggregated_emissions: aggregatedEmissions,
      sustainability_goals: sustainabilityGoals,
    }
  );
}