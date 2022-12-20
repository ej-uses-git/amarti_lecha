export default (a: Date, b: Date) => {
  const aYear = a.getFullYear();
  const bYear = b.getFullYear();
  if (aYear < bYear) return false;
  if (aYear > bYear) return true;

  const aMonth = a.getMonth();
  const bMonth = b.getMonth();
  if (aMonth < bMonth) return false;
  if (aMonth > bMonth) return true;

  const aDay = a.getDate();
  const bDay = b.getDate();
  if (aDay <= bDay) return false;

  return true;
};
