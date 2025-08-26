export interface IStockDataController {
  getStockData(request: Request, code: string): Promise<Response>;
}
