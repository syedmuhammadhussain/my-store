"use client";

import ReviewStars from "./ReviewStars";

export default function ReviewSummary({
  summary,
}: {
  summary: { average: number; total: number; distribution: Record<number, number> };
}) {
  const average = Number(summary.average || 0).toFixed(2);
  const total = summary.total || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="p-6 border rounded-lg">
        <div className="flex items-center gap-3">
          <ReviewStars value={Math.round(Number(summary.average || 0))} />
          <div className="text-lg font-semibold">{average} out of 5</div>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Based on {total} {total === 1 ? "review" : "reviews"}
        </div>
      </div>

      <div className="lg:col-span-2 p-6 border rounded-lg">
        <Distribution distribution={summary.distribution} total={total} />
      </div>
    </div>
  );
}

function Distribution({ distribution, total }: { distribution: Record<number, number>; total: number }) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution?.[star] ?? 0;
        const pct = total ? ((count / total) * 100).toFixed(2) : 0;
        return (
          <div key={star} className="flex items-center gap-3">
            <div className="w-24 flex items-center gap-2">
              <ReviewStars value={star} compact />
            </div>
            <div className="flex-1 bg-gray-100 h-3 rounded overflow-hidden">
              <div className="h-3 bg-black" style={{ width: `${pct}%` }} />
            </div>
            <div className="w-10 text-right text-sm">{count}</div>
          </div>
        );
      })}
    </div>
  );
}