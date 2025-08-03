import { DataRow, ColumnConfig } from "../types";

export const generateColumns = (sampleRow: DataRow): ColumnConfig[] => {
  return Object.keys(sampleRow).map((key: string) => ({
    headerName: formatHeaderName(key),
    field: key,
    width: getColumnWidth(key),
    type: getColumnType(sampleRow[key]),
    sortable: true,
    filter: true,
    resizable: true,
  }));
};

const formatHeaderName = (key: string): string => {
  return key.replace(/([A-Z])/g, " $1").trim();
};

const getColumnWidth = (key: string): number => {
  const widthMap: Record<string, number> = {
    Brand: 150,
    Model: 120,
    Price: 120,
    Range: 100,
    BatteryCapacity: 150,
  };
  return widthMap[key] || 130;
};

const getColumnType = (
  value: any
): "textColumn" | "numericColumn" | "booleanColumn" => {
  if (typeof value === "number") return "numericColumn";
  if (typeof value === "boolean") return "booleanColumn";
  return "textColumn";
};
