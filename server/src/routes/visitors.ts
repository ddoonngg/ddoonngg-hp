import { Router } from "express";

import { visitorsCountService } from "../services/visitorsCountService";

export const visitorsRoute = Router();

visitorsRoute.get("/count", async (req, res) => {
  console.log("GET /count");
  const count = await visitorsCountService.getCount();
  console.log("Count:", count);
  res.json({ count: count });
});

visitorsRoute.post("/count", async (req, res) => {
  const count = visitorsCountService.incrementCount();
  res.json({ count: count });
});
