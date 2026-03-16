export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const dayName = days[date.getUTCDay()];
  const day = date.getUTCDate();
  const ordinal =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
      ? "nd"
      : day === 3 || day === 23
      ? "rd"
      : "th";

  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${dayName} ${String(day).padStart(2, "0")}${ordinal} ${month}, ${year}`;
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getUTCDate();
  const ordinal =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
      ? "nd"
      : day === 3 || day === 23
      ? "rd"
      : "th";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `${day}${ordinal} ${days[date.getUTCDay()]}`;
}
