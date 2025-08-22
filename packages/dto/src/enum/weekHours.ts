export const WEEK_HOURS = [40, 32, 24, 16, 8] as const;
export type WeekHours = (typeof WEEK_HOURS)[number];
