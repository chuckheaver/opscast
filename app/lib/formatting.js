// Human-readable formatters for hours and dates.

export const fmtHour = h =>
  h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`;

export const fmtDate = s =>
  new Date(s + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
