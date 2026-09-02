export const MOCK_REFERENCE_DATE = '2026-09-01T10:00:00.000Z';

export type DateRange = 'ALL_TIME' | 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'THIS_YEAR';

export function getReferenceDate(): Date {
  return new Date(MOCK_REFERENCE_DATE);
}

export function isDateInRange(dateStr: string | undefined | null, range: DateRange): boolean {
  if (!dateStr) return false;
  if (range === 'ALL_TIME') return true;

  const targetDate = new Date(dateStr);
  const refDate = getReferenceDate();

  if (isNaN(targetDate.getTime())) return false;

  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth();
  const targetDay = targetDate.getDate();

  const refYear = refDate.getFullYear();
  const refMonth = refDate.getMonth();
  const refDay = refDate.getDate();

  if (range === 'TODAY') {
    return targetYear === refYear && targetMonth === refMonth && targetDay === refDay;
  }

  if (range === 'THIS_MONTH') {
    return targetYear === refYear && targetMonth === refMonth;
  }

  if (range === 'THIS_YEAR') {
    return targetYear === refYear;
  }

  if (range === 'THIS_WEEK') {
    // Basic "this week" logic relative to refDate
    const startOfWeek = new Date(refDate);
    startOfWeek.setDate(refDate.getDate() - refDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return targetDate >= startOfWeek && targetDate <= endOfWeek;
  }

  return true;
}

export function calculateDaysAgo(dateStr: string): number {
  const target = new Date(dateStr).getTime();
  const ref = getReferenceDate().getTime();
  const diffTime = Math.abs(ref - target);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
