// src/controllers/itemController.ts
import { Request, Response, NextFunction } from "express";
import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";

// Pagination interface
interface Pagination {
  page: number;
  limit: number;
  total: number;
}

const TABLE_NAME = "electric_cars";

// Columns classification
const numericColumns = new Set<string>([
  "AccelSec",
  "TopSpeed_KmH",
  "Range_Km",
  "Efficiency_WhKm",
  "FastCharge_KmH",
  "Seats",
  "PriceEuro",
]);
const textColumns = new Set<string>([
  "Brand",
  "Model",
  "BodyStyle",
  "Segment",
  "PlugType",
  "RapidCharge",
  "PowerTrain",
  "Date",
]);

// Supported filter params type
export interface FilterParams {
  column: string;
  operator:
    | "eq"
    | "equals"
    | "neq"
    | "not equals"
    | "lt"
    | "less than"
    | "lte"
    | "less than or equal"
    | "gt"
    | "greater than"
    | "gte"
    | "greater than or equal"
    | "contains"
    | "like"
    | "ilike"
    | "starts with"
    | "ends with"
    | "is empty";
  value: string | number;
}

// Search endpoint
export const searchItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const q = ((req.query.q as string) || "").trim();
    if (!q)
      return res.status(400).json({ error: "Query param `q` is required" });

    const orFilter = [
      `Brand.ilike.%${q}%`,
      `Model.ilike.%${q}%`,
      `BodyStyle.ilike.%${q}%`,
      `Segment.ilike.%${q}%`,
      `PlugType.ilike.%${q}%`,
      `RapidCharge.ilike.%${q}%`,
      `PowerTrain.ilike.%${q}%`,
    ].join(",");

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .or(orFilter)
      .order("id", { ascending: false });

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

// Get paginated items
export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = parseInt((req.query.limit as string) || "20", 10);
    const page = parseInt((req.query.page as string) || "1", 10);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from(TABLE_NAME)
      .select("*", { count: "exact" })
      .order("id", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const pagination: Pagination = { page, limit, total: count ?? 0 };
    res.json({ data, pagination });
  } catch (err) {
    next(err);
  }
};

// Get single item
export const getItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116")
        return res.status(404).json({ error: "Item not found" });
      throw error;
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// Create new item
export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    // Generate a numeric ID using timestamp + random number
    const numericId =
      payload.id || Date.now() + Math.floor(Math.random() * 1000);

    const itemWithId = {
      ...payload,
      id: numericId,
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(itemWithId)
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
    console.error("Create item error:", err);
  }
};

// Update item
export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq("id", id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// Delete single item
export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

    if (error) throw error;
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// Delete multiple items
export const deleteItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ids = req.body.ids as number[];
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "`ids` must be a non-empty array" });
    }
    const { error } = await supabase.from(TABLE_NAME).delete().in("id", ids);

    if (error) throw error;
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// Filter items with mixed numeric/text strategy
// Filter items with mixed numeric/text strategy
export const filterItems = async (
  req: Request<{}, {}, FilterParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { column, operator, value } = req.body;
    if (!numericColumns.has(column) && !textColumns.has(column)) {
      return res.status(400).json({ error: `Invalid column: ${column}` });
    }

    let builder = supabase.from(TABLE_NAME).select("*");

    switch (operator) {
      case "eq":
      case "equals":
        builder = builder.eq(column, value);
        break;
      case "neq":
      case "not equals":
        builder = builder.neq(column, value);
        break;
      case "lt":
      case "less than":
        builder = builder.lt(column, Number(value));
        break;
      case "lte":
      case "less than or equal":
        builder = builder.lte(column, Number(value));
        break;
      case "gt":
      case "greater than":
        builder = builder.gt(column, Number(value));
        break;
      case "gte":
      case "greater than or equal":
        builder = builder.gte(column, Number(value));
        break;
      case "contains":
      case "like":
      case "ilike": {
        if (numericColumns.has(column)) {
          // For numeric columns doing text-like search, use a custom approach
          // We'll use a raw PostgREST query with proper casting
          const { data, error } = await supabase
            .from(TABLE_NAME)
            .select("*")
            .filter(column, "cs", `{${value}}`) // This won't work for partial matches
            .order("id", { ascending: false });

          // Alternative: If you need true text matching on numeric fields,
          // you might need to create a database function or use rpc
          if (error) {
            // Fallback: try to convert value to number and do exact match
            const numValue = Number(value);
            if (!isNaN(numValue)) {
              const fallbackResult = await supabase
                .from(TABLE_NAME)
                .select("*")
                .eq(column, numValue)
                .order("id", { ascending: false });

              if (fallbackResult.error) throw fallbackResult.error;
              return res.json({ data: fallbackResult.data });
            }
            throw error;
          }
          return res.json({ data });
        } else {
          builder = builder.ilike(column, `%${value}%`);
        }
        break;
      }
      case "starts with": {
        if (numericColumns.has(column)) {
          // For numeric "starts with", interpret as range
          const numValue = Number(value);
          if (isNaN(numValue)) {
            return res.status(400).json({
              error: `Cannot use 'starts with' operator with non-numeric value '${value}' on numeric column '${column}'`,
            });
          }

          // Calculate range for "starts with" logic
          const valueStr = value.toString();
          const nextValue = Number(valueStr + "9".repeat(10 - valueStr.length));

          builder = builder.gte(column, numValue).lte(column, nextValue);
        } else {
          builder = builder.ilike(column, `${value}%`);
        }
        break;
      }
      case "ends with": {
        if (numericColumns.has(column)) {
          // For numeric "ends with", we need to do modulo arithmetic
          const numValue = Number(value);
          if (isNaN(numValue)) {
            return res.status(400).json({
              error: `Cannot use 'ends with' operator with non-numeric value '${value}' on numeric column '${column}'`,
            });
          }

          // This is complex for numeric fields - you might want to disallow this
          // or implement using a custom SQL function
          return res.status(400).json({
            error: `'ends with' operator is not supported for numeric columns. Use exact match operators instead.`,
          });
        } else {
          builder = builder.ilike(column, `%${value}`);
        }
        break;
      }
      case "is empty":
        builder = builder.or(`${column}.is.null,${column}.eq.`);
        break;
      default:
        return res
          .status(400)
          .json({ error: `Unsupported operator: ${operator}` });
    }

    const { data, error } = await builder.order("id", { ascending: false });

    if (error) throw error;

    res.json({ data });
  } catch (err) {
    console.error("Filter error:", err);
    next(err);
  }
};
