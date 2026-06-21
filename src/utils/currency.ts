export const EXCHANGE_RATES: Record<string, number> = {
  CNY: 1,
  USD: 7.25,
  EUR: 7.8,
  GBP: 9.2,
  JPY: 0.047,
  KRW: 0.0052,
  MXN: 0.38,
  SGD: 5.35,
  THB: 0.2,
  AUD: 4.7,
  CAD: 5.3,
  CHF: 8.3,
  HKD: 0.93,
  TWD: 0.23,
};

export const CURRENCY_NAMES: Record<string, string> = {
  CNY: '人民币',
  USD: '美元',
  EUR: '欧元',
  GBP: '英镑',
  JPY: '日元',
  KRW: '韩元',
  MXN: '墨西哥比索',
  SGD: '新加坡元',
  THB: '泰铢',
  AUD: '澳元',
  CAD: '加元',
  CHF: '瑞士法郎',
  HKD: '港币',
  TWD: '新台币',
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  KRW: '₩',
  MXN: '$',
  SGD: 'S$',
  THB: '฿',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  HKD: 'HK$',
  TWD: 'NT$',
};

export function convertToCNY(amount: number, currency: string): number {
  const rate = EXCHANGE_RATES[currency];
  if (!rate) return amount;
  return amount * rate;
}

export function formatPrice(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  return `${symbol} ${amount.toLocaleString()}`;
}

export function calculateTotalCNY(items: Array<{ price: number; currency: string }>): number {
  const total = items.reduce((sum, item) => sum + convertToCNY(item.price, item.currency), 0);
  return Math.round(total * 100) / 100;
}

export const AVAILABLE_CURRENCIES = Object.keys(EXCHANGE_RATES);
