import { Request, Response, NextFunction } from "express";
import { supabase } from "../supabaseClient";

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

const TABLE_NAME = "electric_cars";

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
    console.log("getItems data:", data, "error:", error, "count:", count);
    if (error) throw error;

    const pagination: Pagination = { page, limit, total: count ?? 0 };
    res.json({ data, pagination });
  } catch (err) {
    next(err);
  }
};

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

export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(payload)
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

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
