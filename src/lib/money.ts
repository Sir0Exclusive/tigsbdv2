export const PLATFORM_CURRENCY = "BDT" as const;
export const MINOR_UNITS_PER_BDT = 100;

export function formatBDT(poisha: number): string {
  return `৳${(poisha / MINOR_UNITS_PER_BDT).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}