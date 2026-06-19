export const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "CA$",
  AUD: "A$"
};

export const getCurrencySymbol = (currencyCode) => {
  const code = String(currencyCode || "INR").toUpperCase();
  return CURRENCY_SYMBOLS[code] || code;
};

export const formatCurrency = (amount, currencyCode) => {
  const num = Number(amount || 0);
  const symbol = getCurrencySymbol(currencyCode);
  
  return `${symbol}${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};
