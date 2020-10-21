export function getFirstOfMonth(date) {
  const dateCopy = new Date(date);
  dateCopy.setUTCDate(1);
  return dateCopy.toISOString();
}
