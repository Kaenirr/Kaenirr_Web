import type { Locale } from "../i18n";

export const monthIndex = (yearMonth: string) => {
  const dash = yearMonth.indexOf("-");
  return (
    Number(yearMonth.slice(0, dash)) * 12 + Number(yearMonth.slice(dash + 1)) - 1
  );
};

const currentMonthIndex = () => {
  const now = new Date();
  return now.getFullYear() * 12 + now.getMonth();
};

const unitLabels: Record<Locale, { year: (n: number) => string; month: string }> = {
  en: { year: () => "yr", month: "mo" },
  cs: { year: (n) => (n === 1 ? "rok" : n < 5 ? "roky" : "let"), month: "měs." },
};

export const formatDuration = (
  start: string,
  end: string | null,
  locale: Locale = "en",
) => {
  const total =
    (end ? monthIndex(end) : currentMonthIndex()) - monthIndex(start) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;
  const { year, month } = unitLabels[locale];
  return [years && `${years} ${year(years)}`, months && `${months} ${month}`]
    .filter(Boolean)
    .join(" ");
};
