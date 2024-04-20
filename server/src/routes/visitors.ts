import { Router } from "express";

import { visitorsCountService } from "../services/visitorsCountService";

export const visitorsRoute = Router();

visitorsRoute.get("/count", async (req, res) => {
  const count = await visitorsCountService.getCount();
  console.log("count: ", count);
  res.json({ count });
});

visitorsRoute.post("/count", async (req, res) => {
  const count = await visitorsCountService.incrementCount();
  res.json({ count });
});
