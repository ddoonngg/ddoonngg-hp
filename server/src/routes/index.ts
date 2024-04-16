import { Router } from "express";
import { visitorsRoute } from "./visitors";

const router = Router();

router.use("/visitors", visitorsRoute);

export { router };
