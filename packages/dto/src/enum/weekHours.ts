export const WEEK_HOURS = [8, 16, 24, 32, 40] as const;
export type WeekHours = (typeof WEEK_HOURS)[number];
