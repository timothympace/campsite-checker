export function getDatesFromRange(start, end) {
  start = new Date(start);
  end = new Date(end);

  if (start.getTime() > end.getTime()) {
    throw new Error(`Start date (${start}) is later than end date (${end})`);
  }

  if (start === end) {
    return [start];
  }

  const dates = [];
  while (start.getTime() !== end.getTime()) {
    dates.push(start.toISOString());
    start = new Date(start);
    start.setUTCDate(start.getUTCDate() + 1);
  }

  return dates;
}
