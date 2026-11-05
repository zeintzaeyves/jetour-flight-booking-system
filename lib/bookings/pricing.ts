/**
 * Fares are stored as all-inclusive per-passenger prices (PHP). There is no
 * separate tax/fee data in the system, so none is invented here.
 */
export function computeTotal(unitPrice: number, passengers: number): number {
  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    throw new RangeError("Invalid unit price");
  }
  if (!Number.isInteger(passengers) || passengers < 1) {
    throw new RangeError("Invalid passenger count");
  }
  return Math.round(unitPrice * passengers * 100) / 100;
}
