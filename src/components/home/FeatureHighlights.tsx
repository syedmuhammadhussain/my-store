// components/FeatureHighlights.tsx
import { Leaf, HeartHandshake, Sparkles } from "lucide-react";

export function FeatureHighlights() {
  const items = [
    {
      icon: Leaf,
      title: "Luxurious Organic Comfort",
      subtitle: "Skin Friendly",
    },
    {
      icon: HeartHandshake,
      title: "Ethical & Sustainable Production",
      subtitle: "Made with Love",
    },
    {
      icon: Sparkles,
      title: "Trendy Prints & Cuts",
      subtitle: "Effortlessly Chic",
    },
  ];

  return (
    <section aria-label="Brand values" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map(({ icon: Icon, title, subtitle }) => (
            <li
              key={title}
              className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-5 transition-colors hover:bg-white"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-neutral-900">
                  {title}
                </p>
                <p className="text-sm text-neutral-600">{subtitle}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
