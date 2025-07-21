export function Time({ timestamp }: { timestamp: Date | string }) {
  const date = new Date(timestamp);
  return (
    <span suppressHydrationWarning>
      {date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).toUpperCase()}
    </span>
  );
}
