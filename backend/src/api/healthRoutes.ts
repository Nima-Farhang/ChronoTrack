// backend/src/api/healthRoutes.ts
import { Router, Request, Response } from "express";

const router = Router();

// GET /health
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: "ChronoTrack  is working" });
});

export default router;
