export const generateReferralCode = (name: string) => {
  const base = name.replace(/\s+/g, "").slice(0, 4).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${base}${random}`;
};
