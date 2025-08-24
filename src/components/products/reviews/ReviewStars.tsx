/* -----------------------------
   Stars component
   ----------------------------- */
export default function ReviewStars({ value, compact }: { value?: number; compact?: boolean }) {
  const v = Math.round(value ?? 0);
  const classes = compact
    ? "w-3 h-3 sm:w-4 sm:h-4 text-violet-500/65"
    : "w-4 h-4 sm:w-5 sm:h-5 text-violet-500/65";
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`${classes} inline-block`}
          viewBox="0 0 20 20"
          fill={i < v ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.2}
        >
          <path d="M10 1.6l2.6 5.27L18.6 8.2l-4.2 3.9.98 5.7L10 14.77 4.62 17.9l.98-5.7L1.4 8.2l5.99-.33L10 1.6z" />
        </svg>
      ))}
    </div>
  );
}
