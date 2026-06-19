const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in ms
const rateCache = {};

// Hardcoded fallback rates
const FALLBACK_RATES = {
  USD: { INR: 83.5, EUR: 0.92, GBP: 0.78, JPY: 155.0, CAD: 1.36, AUD: 1.50, USD: 1.0 },
  INR: { USD: 0.012, EUR: 0.011, GBP: 0.0093, JPY: 1.86, CAD: 0.016, AUD: 0.018, INR: 1.0 },
  EUR: { USD: 1.09, INR: 90.5, GBP: 0.85, JPY: 168.0, CAD: 1.48, AUD: 1.63, EUR: 1.0 },
  GBP: { USD: 1.28, INR: 106.8, EUR: 1.18, JPY: 198.0, CAD: 1.74, AUD: 1.92, GBP: 1.0 },
  JPY: { USD: 0.0065, INR: 0.54, EUR: 0.006, GBP: 0.005, CAD: 0.0088, AUD: 0.0097, JPY: 1.0 },
  CAD: { USD: 0.74, INR: 61.4, EUR: 0.68, GBP: 0.57, JPY: 114.0, AUD: 1.10, CAD: 1.0 },
  AUD: { USD: 0.67, INR: 55.7, EUR: 0.61, GBP: 0.52, JPY: 103.0, CAD: 0.91, AUD: 1.0 }
};

export async function getExchangeRate(fromCurrency, toCurrency) {
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();

  if (from === to) return 1.0;

  // Check cache first
  const now = Date.now();
  if (rateCache[from] && (now - rateCache[from].timestamp < CACHE_DURATION)) {
    if (rateCache[from].rates[to]) {
      return rateCache[from].rates[to];
    }
  }

  // Try to fetch from API
  try {
    const response = await fetch(`https://api.frankfurter.app/latest?from=${from}`);
    if (!response.ok) {
      // Try fallback URL
      const fallbackResponse = await fetch(`https://api.frankfurter.dev/v1/latest?from=${from}`);
      if (!fallbackResponse.ok) {
        throw new Error("Frankfurter API failed");
      }
      const data = await fallbackResponse.json();
      rateCache[from] = {
        rates: { ...data.rates, [from]: 1.0 },
        timestamp: now
      };
      return rateCache[from].rates[to] || getFallbackRate(from, to);
    }
    const data = await response.json();
    rateCache[from] = {
      rates: { ...data.rates, [from]: 1.0 },
      timestamp: now
    };
    if (rateCache[from].rates[to]) {
      return rateCache[from].rates[to];
    }
  } catch (error) {
    console.warn(`Failed to fetch exchange rates for ${from} from API. Using fallback rates.`, error.message);
  }

  // Use fallback rates if API fails or rate is not found in API response
  return getFallbackRate(from, to);
}

function getFallbackRate(from, to) {
  if (FALLBACK_RATES[from] && FALLBACK_RATES[from][to]) {
    return FALLBACK_RATES[from][to];
  }
  // Try cross-rate using USD
  if (from !== 'USD' && to !== 'USD') {
    const usdToFrom = FALLBACK_RATES['USD'][from];
    const usdToTo = FALLBACK_RATES['USD'][to];
    if (usdToFrom && usdToTo) {
      return usdToTo / usdToFrom;
    }
  }
  return 1.0; // absolute fallback
}
