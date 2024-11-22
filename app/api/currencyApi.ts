import { EXCHANGE_RATE_API_KEY } from '@env';

export interface Currency {
  code: string;
  description: string;
}

export const CurrencyApi = {
  async fetchSupportedCurrencies(): Promise<Currency[]> {
    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/codes`
      );
      const json: { supported_codes: [string, string][] } = await response.json();

      return json.supported_codes.map(([code, description]) => ({
        code,
        description,
      }));
    } catch (error) {
      console.error('Failed to fetch currencies:', error);
      throw new Error('Failed to load currency options');
    }
  },

  async convertCurrency(
    baseCurrency: string, 
    finalCurrency: string, 
    amount: string
  ): Promise<string> {
    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/pair/${baseCurrency}/${finalCurrency}/${amount}`
      );
      const json = await response.json();
      return json.conversion_result.toString();
    } catch (error) {
      console.error('Currency conversion failed:', error);
      throw new Error('Failed to convert currency');
    }
  }
};