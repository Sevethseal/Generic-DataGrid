import { Router } from "express";
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  deleteItems,
  searchItems,
  filterItems,
} from "../controllers/itemController";

const router = Router();

router.get("/items", getItems);
router.get("/items/:id", getItem);
router.post("/items", createItem);
router.put("/items/:id", updateItem);
router.delete("/items/:id", deleteItem);
router.delete("/items", deleteItems);
router.get("/search", searchItems);
router.post("/filter", filterItems); 

export default router;
