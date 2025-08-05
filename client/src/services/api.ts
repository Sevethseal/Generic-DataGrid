import { DataRow, FilterConfig } from "../types";
import {
  ApiResponse,
  SearchParams,
  FilterParams as ApiFilterParams,
  ApiError,
} from "../types/api";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const handleApiError = (error: any): never => {
  const apiError: ApiError = {
    message: error.message || "An error occurred",
    status: error.status,
  };
  throw apiError;
};

export const fetchData = async (): Promise<DataRow[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/items`);
    if (!response.ok) throw new Error("Failed to fetch items");
    const apiResponse: ApiResponse<DataRow[]> = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error("API Error:", error);
    return getMockData();
  }
};

export const fetchById = async (id: string): Promise<DataRow> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/items/${encodeURIComponent(id)}`
    );
    if (!response.ok) throw new Error(`Failed to fetch item id=${id}`);
    const apiResponse: DataRow = await response.json();
    return apiResponse;
  } catch (error) {
    console.error("FetchById Error:", error);
    return Promise.reject(error);
  }
};

export const searchData = async (searchTerm: string): Promise<DataRow[]> => {
  try {
    const params: SearchParams = { q: searchTerm };
    const response = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(params.q)}`
    );
    if (!response.ok) throw new Error("Failed to search items");
    const apiResponse: ApiResponse<DataRow[]> = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error("Search Error:", error);
    return getMockData().filter((item) =>
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }
};

export const filterData = async (
  filterConfig: FilterConfig
): Promise<DataRow[]> => {
  try {
    const params: ApiFilterParams = {
      column: filterConfig.column,
      operator: filterConfig.operator,
      value: filterConfig.value,
    };
    const response = await fetch(`${API_BASE_URL}/filter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error("Failed to filter items");
    const apiResponse: ApiResponse<DataRow[]> = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error("Filter Error:", error);
    return getMockData().filter((item) =>
      applyFilter(
        item,
        filterConfig.column,
        filterConfig.operator,
        filterConfig.value
      )
    );
  }
};

export const createItem = async (newItem: DataRow): Promise<DataRow> => {
  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    if (!response.ok) throw new Error("Failed to create item");
    const apiResponse: DataRow = await response.json();
    return apiResponse;
  } catch (error) {
    console.error("Create Error:", error);
    return Promise.reject(error);
  }
};

export const updateItem = async (
  id: string,
  updates: Partial<DataRow>
): Promise<DataRow> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/items/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }
    );
    if (!response.ok) throw new Error(`Failed to update item id=${id}`);
    const apiResponse: DataRow = await response.json();
    return apiResponse;
  } catch (error) {
    console.error("Update Error:", error);
    return Promise.reject(error);
  }
};

export const deleteItem = async (id: string): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/items/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error(`Failed to delete item id=${id}`);
  } catch (error) {
    console.error("Delete Error:", error);
    return Promise.reject(error);
  }
};

export const deleteItems = async (ids: string[]): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (!response.ok) throw new Error("Failed to delete items");
  } catch (error) {
    console.error("Batch Delete Error:", error);
    return Promise.reject(error);
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
