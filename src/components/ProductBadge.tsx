export default function ProductBadge({ label }: { label: string }) {
  const base = "px-2 py-0.5 text-xs font-semibold rounded";
  const styles: Record<string, string> = {
    "Sold Out": "bg-red-100 text-red-700",
    "Low Stock": "bg-yellow-100 text-yellow-700",
    New: "bg-green-100 text-green-700",
    Discount: "bg-blue-100 text-blue-700",
    Trending: "bg-purple-100 text-purple-700",
  };

  return (
    <span className={`${base} ${styles[label] ?? "bg-gray-100 text-gray-700"}`}>
      {label}
    </span>
  );
}
