import JQuantsAuth from './auth';

export interface DailyQuote {
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
}

/**
 * J-Quants API呼び出しクラス
 */
class JQuantsApi {
  private static instance: JQuantsApi;
  private auth: JQuantsAuth;

  private constructor() {
    this.auth = JQuantsAuth.getInstance();
  }

  public static getInstance(): JQuantsApi {
    if (!JQuantsApi.instance) {
      JQuantsApi.instance = new JQuantsApi();
    }
    return JQuantsApi.instance;
  }

  /**
   * 日足の株価データを取得
   * @param code 証券コード
   * @param from 開始日（YYYY-MM-DD形式）
   * @param to 終了日（YYYY-MM-DD形式）
   */
  public async getDailyQuotes(
    code: string,
    from: string,
    to: string
  ): Promise<DailyQuote[]> {
    const apiKey = await this.auth.getApiKey();

    console.log('Fetching daily quotes with params:', { code, from, to });
    console.log('Using API key:', apiKey);

    const response = await fetch(
      `https://api.jquants.com/v1/prices/daily_quotes?code=${code}&from=${from}&to=${to}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`Failed to fetch daily quotes: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    
    if (!data.daily_quotes) {
      throw new Error('Daily quotes not found in response');
    }

    return data.daily_quotes;
  }

  /**
   * 指定した証券コードが存在するかチェック
   * @param code 証券コード
   */
  public async validateStockCode(code: string): Promise<boolean> {
    const apiKey = await this.auth.getApiKey();

    const response = await fetch(
      `https://api.jquants.com/v1/listed/info?code=${code}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.info && data.info.length > 0;
  }
}

export default JQuantsApi;
