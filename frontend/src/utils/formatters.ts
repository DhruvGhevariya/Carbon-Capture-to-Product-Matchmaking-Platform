/**
 * CarbonX Centralized Number & Unit Formatter Utilities
 * Enforces scientific precision, currency standards (INR/USD), and explicit unit labels across all screens.
 */

export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUSD(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTons(tons: number, unit = 't CO₂'): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 1,
  }).format(tons);
  return `${formatted} ${unit}`;
}

export function formatPurity(purity: number): string {
  return `${purity.toFixed(1)}%`;
}

export function formatPressure(bar: number): string {
  return `${bar.toFixed(2)} bar`;
}

export function formatTemperature(celsius: number): string {
  return `${celsius.toFixed(1)}°C`;
}

export function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`;
}

export function formatTariff(pricePerTon: number): string {
  return `₹${Math.round(pricePerTon).toLocaleString('en-IN')}/ton`;
}
