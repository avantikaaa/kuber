export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // TODO: temporarily relaxed to min-length only — restore uppercase/lowercase/number checks before shipping
  return password.length >= 8;
};

export const validateCurrency = (currency: string): boolean => {
  const validCurrencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SEK', 'NZD'];
  return validCurrencies.includes(currency.toUpperCase());
};

export const validateAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 999999.99;
};

export const validatePaymentMode = (mode: string): boolean => {
  const validModes = ['card', 'bank_transfer', 'cash', 'upi', 'wallet', 'cheque'];
  return validModes.includes(mode.toLowerCase());
};
