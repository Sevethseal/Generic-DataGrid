import { Router } from "express";

const router = Router();

// Example route
router.get("/", (req, res) => {
  res.send("API is working!");
});

export default router;
