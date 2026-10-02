export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
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
