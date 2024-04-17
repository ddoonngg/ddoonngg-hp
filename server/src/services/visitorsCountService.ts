import { redisClient } from "../redis";

class VisitorsCountService {
  private static readonly vistorsCount = "visitors_count";

  constructor() {
    this.init();
  }

  async init() {
    await redisClient.connect();
  }

  public async incrementCount() {
    return redisClient.incr(VisitorsCountService.vistorsCount);
  }

  public async getCount() {
    const count = await redisClient.get(VisitorsCountService.vistorsCount);
    return count ? parseInt(count) : 0;
  }
}

export const visitorsCountService = new VisitorsCountService();
