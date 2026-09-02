export const MOCK_REFERENCE_DATE = '2026-09-01T10:00:00.000Z';

export const getDateOffset = (days: number): string => {
  const d = new Date(MOCK_REFERENCE_DATE);
  d.setDate(d.getDate() + days);
  return d.toISOString();
};
