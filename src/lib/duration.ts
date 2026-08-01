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

export const formatDuration = (start: string, end: string | null) => {
  const total =
    (end ? monthIndex(end) : currentMonthIndex()) - monthIndex(start) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;
  return [years && `${years} yr`, months && `${months} mo`]
    .filter(Boolean)
    .join(" ");
};
