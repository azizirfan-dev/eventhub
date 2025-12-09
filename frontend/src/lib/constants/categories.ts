export const CATEGORIES = [
  "Music",
  "Education",
  "Sports",
  "Technology",
  "Art",
  "Business",
] as const;

export type Category = (typeof CATEGORIES)[number];
