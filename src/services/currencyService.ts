
interface ExchangeApiResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: { [key: string]: number };
}

export interface CurrencyRate {
  code: string;
  name: string;
  nameEn: string;
  rate: number;
  flag: string;
}

const currencyNames: { [key: string]: { ar: string; en: string; flag: string } } = {
  'USD': { ar: 'دولار أمريكي', en: 'US Dollar', flag: '🇺🇸' },
  'SAR': { ar: 'ريال سعودي', en: 'Saudi Riyal', flag: '🇸🇦' },
  'AED': { ar: 'درهم إماراتي', en: 'UAE Dirham', flag: '🇦🇪' },
  'EUR': { ar: 'يورو', en: 'Euro', flag: '🇪🇺' },
  'GBP': { ar: 'جنيه إسترليني', en: 'British Pound', flag: '🇬🇧' },
  'JPY': { ar: 'ين ياباني', en: 'Japanese Yen', flag: '🇯🇵' },
  'EGP': { ar: 'جنيه مصري', en: 'Egyptian Pound', flag: '🇪🇬' },
  'JOD': { ar: 'دينار أردني', en: 'Jordanian Dinar', flag: '🇯🇴' },
  'KWD': { ar: 'دينار كويتي', en: 'Kuwaiti Dinar', flag: '🇰🇼' },
  'QAR': { ar: 'ريال قطري', en: 'Qatari Riyal', flag: '🇶🇦' },
  'BHD': { ar: 'دينار بحريني', en: 'Bahraini Dinar', flag: '🇧🇭' },
  'OMR': { ar: 'ريال عماني', en: 'Omani Rial', flag: '🇴🇲' },
  'CAD': { ar: 'دولار كندي', en: 'Canadian Dollar', flag: '🇨🇦' },
  'AUD': { ar: 'دولار أسترالي', en: 'Australian Dollar', flag: '🇦🇺' },
  'CHF': { ar: 'فرنك سويسري', en: 'Swiss Franc', flag: '🇨🇭' },
  'CNY': { ar: 'يوان صيني', en: 'Chinese Yuan', flag: '🇨🇳' },
  'INR': { ar: 'روبية هندية', en: 'Indian Rupee', flag: '🇮🇳' },
  'TRY': { ar: 'ليرة تركية', en: 'Turkish Lira', flag: '🇹🇷' },
  'RUB': { ar: 'روبل روسي', en: 'Russian Ruble', flag: '🇷🇺' },
  'BRL': { ar: 'ريال برازيلي', en: 'Brazilian Real', flag: '🇧🇷' }
};

const supportedCurrencies = Object.keys(currencyNames);

export const fetchExchangeRates = async (): Promise<CurrencyRate[]> => {
  try {
    // Using exchangerate-api.com (free tier: 1500 requests/month)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: any = await response.json();
    
    const rates: CurrencyRate[] = [];
    
    // Add USD as base currency
    rates.push({
      code: 'USD',
      name: currencyNames['USD'].ar,
      nameEn: currencyNames['USD'].en,
      rate: 1,
      flag: currencyNames['USD'].flag
    });
    
    // Add other currencies
    supportedCurrencies.forEach(currency => {
      if (currency !== 'USD' && data.rates[currency]) {
        const currencyInfo = currencyNames[currency];
        rates.push({
          code: currency,
          name: currencyInfo.ar,
          nameEn: currencyInfo.en,
          rate: data.rates[currency],
          flag: currencyInfo.flag
        });
      }
    });
    
    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Fallback to static rates if API fails
    return getFallbackRates();
  }
};

const getFallbackRates = (): CurrencyRate[] => {
  // Updated fallback rates for 2025
  const fallbackData: { [key: string]: number } = {
    'USD': 1,
    'SAR': 3.75,
    'AED': 3.67,
    'EUR': 0.91,
    'GBP': 0.78,
    'JPY': 155.20,
    'EGP': 51.15,
    'JOD': 0.71,
    'KWD': 0.31,
    'QAR': 3.64,
    'BHD': 0.38,
    'OMR': 0.38,
    'CAD': 1.44,
    'AUD': 1.62,
    'CHF': 0.93,
    'CNY': 7.31,
    'INR': 85.45,
    'TRY': 35.12,
    'RUB': 97.85,
    'BRL': 6.28
  };
  
  return supportedCurrencies.map(currency => ({
    code: currency,
    name: currencyNames[currency].ar,
    nameEn: currencyNames[currency].en,
    rate: fallbackData[currency] || 1,
    flag: currencyNames[currency].flag
  }));
};
