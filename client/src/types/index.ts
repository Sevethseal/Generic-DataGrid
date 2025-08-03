export interface DataRow {
  [key: string]: string | number | boolean | null | undefined;
}

export interface ColumnConfig {
  headerName: string;
  field: string;
  width?: number;
  type?: "textColumn" | "numericColumn" | "booleanColumn";
  sortable?: boolean;
  filter?: boolean;
  resizable?: boolean;
  pinned?: "left" | "right";
  cellRenderer?: string | React.ComponentType<any>;
}

export interface FilterConfig {
  column: string;
  operator: FilterOperator;
  value: string;
}

export type FilterOperator =
  | "contains"
  | "equals"
  | "starts with"
  | "ends with"
  | "is empty"
  | "greater than"
  | "less than";

export interface DataGridProps {
  data: DataRow[];
  loading: boolean;
  onSearch: (term: string) => void;
  onFilter: (filters: FilterConfig) => void;
  searchTerm: string;
  filters: FilterConfig;
}

export interface FilterToolbarProps {
  onSearch: (term: string) => void;
  onFilter: (filters: FilterConfig) => void;
  searchTerm: string;
  filters: FilterConfig;
  columns: ColumnConfig[];
}

export interface ActionRendererProps {
  data: DataRow;
}

export interface DetailViewProps {
  data: DataRow | null;
}

export interface UseDataGridReturn {
  data: DataRow[];
  loading: boolean;
  searchTerm: string;
  filters: FilterConfig;
  handleSearch: (term: string) => void;
  handleFilter: (filterConfig: FilterConfig) => void;
}
