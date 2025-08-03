import { DataRow, FilterConfig } from "../types";
import {
  ApiResponse,
  SearchParams,
  FilterParams,
  ApiError,
} from "../types/api";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const handleApiError = (error: any): never => {
  const apiError: ApiError = {
    message: error.message || "An error occurred",
    status: error.status,
  };
  throw apiError;
};

export const fetchData = async (): Promise<DataRow[]> => {
  try {
    // const response = await fetch(`${API_BASE_URL}/data`);
    // if (!response.ok) throw new Error("Failed to fetch");

    // const apiResponse: ApiResponse<DataRow[]> = await response.json();
    // return apiResponse.data;
    return getMockData();
  } catch (error) {
    console.error("API Error:", error);
    // Return mock data for development
    return getMockData();
  }
};

export const searchData = async (searchTerm: string): Promise<DataRow[]> => {
  try {
    const params: SearchParams = { q: searchTerm };
    const response = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(params.q)}`
    );
    if (!response.ok) throw new Error("Failed to search");

    const apiResponse: ApiResponse<DataRow[]> = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error("Search Error:", error);
    return getMockData().filter((item: DataRow) =>
      Object.values(item).some((value: any) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }
};

export const filterData = async (
  filterConfig: FilterConfig
): Promise<DataRow[]> => {
  try {
    const params: FilterParams = {
      column: filterConfig.column,
      operator: filterConfig.operator,
      value: filterConfig.value,
    };

    const response = await fetch(`${API_BASE_URL}/filter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!response.ok) throw new Error("Failed to filter");

    const apiResponse: ApiResponse<DataRow[]> = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error("Filter Error:", error);
    return getMockData().filter((item: DataRow) =>
      applyFilter(
        item,
        filterConfig.column,
        filterConfig.operator,
        filterConfig.value
      )
    );
  }
};

const applyFilter = (
  item: DataRow,
  column: string,
  operator: string,
  value: string
): boolean => {
  const fieldValue = item[column]?.toString().toLowerCase() || "";
  const filterValue = value.toLowerCase();

  switch (operator) {
    case "contains":
      return fieldValue.includes(filterValue);
    case "equals":
      return fieldValue === filterValue;
    case "starts with":
      return fieldValue.startsWith(filterValue);
    case "ends with":
      return fieldValue.endsWith(filterValue);
    case "is empty":
      return !fieldValue;
    case "greater than":
      return parseFloat(fieldValue) > parseFloat(filterValue);
    case "less than":
      return parseFloat(fieldValue) < parseFloat(filterValue);
    default:
      return true;
  }
};

const getMockData = (): DataRow[] => [
  {
    Brand: "BMW",
    Model: "i4",
    BatteryCapacity: "80 kWh",
    Range: "300 km",
    Price: "€56,000",
  },
  {
    Brand: "BMW",
    Model: "iX3",
    BatteryCapacity: "74 kWh",
    Range: "400 km",
    Price: "€54,200",
  },
  {
    Brand: "BMW",
    Model: "i3",
    BatteryCapacity: "42.2 kWh",
    Range: "310 km",
    Price: "€39,900",
  },
  {
    Brand: "BMW",
    Model: "iX",
    BatteryCapacity: "105.2 kWh",
    Range: "520 km",
    Price: "€85,000",
  },
];
