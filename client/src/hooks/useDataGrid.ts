import { useState, useEffect } from "react";
import { fetchData, searchData, filterData } from "../services/api";
import { DataRow, FilterConfig, UseDataGridReturn } from "../types";

const useDataGrid = (): UseDataGridReturn => {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<FilterConfig>({
    column: "",
    operator: "contains",
    value: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm);
    } else if (filters.column && filters.value) {
      handleFilter(filters);
    } else {
      loadData();
    }
  }, [searchTerm, filters]);

  const loadData = async (): Promise<void> => {
    setLoading(true);
    try {
      const result = await fetchData();
      setData(result);
    } catch (error) {
      console.error("Error loading data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string): Promise<void> => {
    setSearchTerm(term);
    if (!term) {
      loadData();
      return;
    }

    setLoading(true);
    try {
      const result = await searchData(term);
      setData(result);
    } catch (error) {
      console.error("Error searching:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (filterConfig: FilterConfig): Promise<void> => {
    setFilters(filterConfig);
    if (!filterConfig.column || !filterConfig.value) {
      loadData();
      return;
    }

    setLoading(true);
    try {
      const result = await filterData(filterConfig);
      setData(result);
    } catch (error) {
      console.error("Error filtering:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    searchTerm,
    filters,
    handleSearch,
    handleFilter,
    loadData,
  };
};

export default useDataGrid;
