export interface IStockDataService {
  getStockData(code: string, from: string, to: string): Promise<any>;
  validateStockCode(code: string): Promise<boolean>;
}
