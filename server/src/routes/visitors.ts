import { Router } from "express";

import { visitorsCountService } from "../services/visitorsCountService";

export const visitorsRoute = Router();

visitorsRoute.get("/count", (req, res) => {
  res.json({ count: visitorsCountService.getCount() });
});

visitorsRoute.post("/count", (req, res) => {
  visitorsCountService.incrementCount();
  res.json({ count: visitorsCountService.getCount() });
});
