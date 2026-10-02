// Bank-specific patterns for transaction extraction
export const emailPatterns = {
  // Amount patterns: ₹X,XXX or $X,XXX or €X,XXX
  amount: /[₹$€]\s*([0-9,]+\.[0-9]{2}|[0-9,]+)/gi,

  // Date patterns: DD-MM-YYYY, DD/MM/YYYY, etc.
  date: /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/g,

  // Account patterns: account ending in XXXX
  accountEnding: /(?:account|acc|a\/c)[\s:]*(?:ending|end|#|no\.?)?[\s]*\*{2,4}(\d{4})/gi,

  // Transaction type keywords
  transactionTypes: {
    debit: /debit|withdrawn|paid|charged|debited|spent/gi,
    credit: /credit|credited|received|transferred in|deposit|deposited/gi,
  },

  // Payment mode keywords
  paymentModes: {
    card: /(?:credit|debit|card|visa|mastercard)[\s\w]*(?:card|ending|•{2,4})?\s*\d{2,4}/gi,
    upi: /upi|unified payment/gi,
    neft: /neft|national electronic fund transfer/gi,
    rtgs: /rtgs|real time gross settlement/gi,
    imps: /imps|immediate payment service/gi,
    cheque: /cheque|check/gi,
    wallet: /wallet|paytm|googlepay|applepay|paypal/gi,
  },

  // Merchant/description keywords
  merchant: /(?:at|to|from|merchant:?|shop:?|store:?|vendor:?)\s+([A-Za-z0-9\s&\-.']+)(?:\.|,|$)/gi,
};

// Bank-specific patterns
export const bankPatterns: Record<string, Record<string, RegExp>> = {
  hdfc: {
    amount: /amount\s*[₹$€]\s*([0-9,]+\.[0-9]{2})/gi,
    date: /(\d{1,2}-[A-Za-z]{3}-\d{4})/g,
    mode: /via\s+([a-z\s]+?)(?:\.|$)/gi,
    account: /account\s*(?:ending|end)?\s*\*{2,4}(\d{4})/gi,
  },
  icici: {
    amount: /amount\s+[₹$€]\s*([0-9,]+\.[0-9]{2})/gi,
    date: /on\s+(\d{1,2}-\d{1,2}-\d{4})/gi,
    mode: /through\s+([a-z\s]+?)(?:\.|$)/gi,
  },
  axis: {
    amount: /[₹$€]\s*([0-9,]+(?:\.[0-9]{2})?)/gi,
    date: /(\d{1,2}\/\d{1,2}\/\d{4})/g,
    mode: /(?:card|mode)[\s:]+([a-z\s]+?)(?:\.|$)/gi,
  },
};

// Common merchant keywords for category matching
export const merchantKeywords: Record<string, string[]> = {
  'Food & Dining': ['starbucks', 'mcdonald', 'burger', 'pizza', 'restaurant', 'cafe', 'grocery', 'walmart', 'costco', 'whole foods', 'trader joe', 'amazon fresh'],
  'Transportation': ['uber', 'lyft', 'taxi', 'gas station', 'shell', 'exxon', 'chevron', 'parking', 'transit', 'metro'],
  'Shopping': ['amazon', 'walmart', 'target', 'costco', 'mall', 'store', 'shop'],
  'Entertainment': ['netflix', 'hulu', 'disney', 'cinema', 'movie', 'theater', 'spotify', 'gaming'],
  'Utilities': ['electric', 'water', 'gas', 'internet', 'phone', 'verizon', 'at&t', 'comcast'],
  'Health & Fitness': ['gym', 'doctor', 'hospital', 'pharmacy', 'clinic', 'health'],
};

export const extractAmount = (text: string): number | null => {
  const match = text.match(/[₹$€]\s*([0-9,]+\.[0-9]{2}|[0-9,]+)/i);
  if (!match) return null;
  return parseFloat(match[1].replace(/,/g, ''));
};

export const extractDate = (text: string): Date | null => {
  // Try multiple date formats
  const formats = [
    /(\d{1,2})-([A-Za-z]{3})-(\d{4})/, // DD-MMM-YYYY
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // DD/MM/YYYY
    /(\d{1,2})-(\d{1,2})-(\d{4})/, // DD-MM-YYYY
  ];

  for (const format of formats) {
    const match = text.match(format);
    if (match) {
      try {
        return new Date(match[3] + '-' + match[2] + '-' + match[1]);
      } catch {
        continue;
      }
    }
  }
  return null;
};

export const extractMerchant = (text: string): string | null => {
  const match = text.match(/(?:at|to|from|merchant:?|shop:?|store:?)\s+([A-Za-z0-9\s&\-.']+)(?:\.|,|$)/i);
  return match ? match[1].trim() : null;
};

export const guessPaymentMode = (text: string): string | null => {
  const text_lower = text.toLowerCase();
  if (/card|visa|mastercard/.test(text_lower)) return 'card';
  if (/upi/.test(text_lower)) return 'upi';
  if (/bank transfer|neft|rtgs|imps/.test(text_lower)) return 'bank_transfer';
  if (/cheque/.test(text_lower)) return 'cheque';
  if (/wallet|paytm|googlepay|applepay/.test(text_lower)) return 'wallet';
  if (/cash/.test(text_lower)) return 'cash';
  return null;
};
