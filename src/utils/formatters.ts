export type Currency = 'AED' | 'USD' | 'EUR' | 'GBP';

// Standard fixed UAE Central Bank peg & market rates
export const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string; label: string }> = {
  AED: { rate: 1.0, symbol: 'AED', label: 'UAE Dirham (AED)' },
  USD: { rate: 0.2723, symbol: '$', label: 'US Dollar (USD)' },
  EUR: { rate: 0.2510, symbol: '€', label: 'Euro (EUR)' },
  GBP: { rate: 0.2155, symbol: '£', label: 'British Pound (GBP)' },
};

export function formatCurrency(amountInAed: number, currency: Currency = 'AED'): string {
  const info = CURRENCY_RATES[currency] || CURRENCY_RATES.AED;
  const converted = amountInAed * info.rate;

  if (currency === 'AED') {
    return `${new Intl.NumberFormat('en-AE', { maximumFractionDigits: 0 }).format(converted)} AED`;
  }
  return `${info.symbol}${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(converted)}`;
}

export function formatAedShort(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = (amount / 1_000_000).toFixed(1).replace(/\.0$/, '');
    return `${millions}M AED`;
  }
  if (amount >= 1_000) {
    const thousands = (amount / 1_000).toFixed(0);
    return `${thousands}K AED`;
  }
  return `${amount} AED`;
}

export function calculateMortgage(
  propertyPriceAed: number,
  downPaymentPercent: number = 20,
  annualInterestRatePercent: number = 4.25,
  loanTermYears: number = 25
): {
  loanAmount: number;
  downPaymentAmount: number;
  monthlyRepayment: number;
  totalInterest: number;
  totalPayable: number;
} {
  const downPaymentAmount = (propertyPriceAed * downPaymentPercent) / 100;
  const loanAmount = propertyPriceAed - downPaymentAmount;
  const monthlyRate = annualInterestRatePercent / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  let monthlyRepayment = 0;
  if (monthlyRate === 0) {
    monthlyRepayment = loanAmount / numberOfPayments;
  } else {
    monthlyRepayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  const totalPayable = monthlyRepayment * numberOfPayments;
  const totalInterest = totalPayable - loanAmount;

  return {
    loanAmount: Math.round(loanAmount),
    downPaymentAmount: Math.round(downPaymentAmount),
    monthlyRepayment: Math.round(monthlyRepayment),
    totalInterest: Math.round(totalInterest),
    totalPayable: Math.round(totalPayable),
  };
}
