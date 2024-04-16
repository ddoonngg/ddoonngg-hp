class VisitorsCountService {
  private count: number = 0;

  public incrementCount() {
    this.count++;
  }

  public getCount() {
    return this.count;
  }
}

export const visitorsCountService = new VisitorsCountService();
