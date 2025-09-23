export type Tier = "cruiser" | "power" | "pro";
// Carpool GPT Token Formula (locked v2.1)
export const TOKEN_FORMULA_V2_1 = {
cruiser: { personal: 1_000_000, bufferToPool: 500_000, reserveCap: 5_000_000 },
power: { personal: 2_000_000, bufferToPool: 1_000_000, reserveCap: 10_000_000 },
pro: { personal: 4_000_000, bufferToPool: 2_000_000, reserveCap: 20_000_000 },
} as const;
export const SPEND_ORDER = ["personal", "reserve", "community_bonus"] as
const;
export type SpendBucket = typeof SPEND_ORDER[number];