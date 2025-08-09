import Link from "next/link";
import { CategoryAttributes } from "@/types/category";

interface Props {
  subCategories: CategoryAttributes[];
  name: string;
  slug: string;
}

export default function CategoryButton({ subCategories, name }: Props) {
  return (
    <div className="p-3 text-left justify-center md:my-6">
      <h3 className="font-medium mb-5 text-xl md:text-3xl">{name}</h3>
      <div className="flex flex-wrap gap-2">
        {subCategories
          // .filter((cat) => cat.slug !== slug)
          .map((cat) => (
            <button
              key={cat.slug}
              className={`
              text-xs md:text-sm uppercase cursor-pointer flex-1 min-w-[120px] max-w-full
              px-3 py-2 font-medium text-center border-2 border-gray-600 shadow-none rounded-md
              transition-colors duration-200 text-black hover:bg-gray-100
            `}
            >
              <Link href={cat.slug}>{cat.name}</Link>
            </button>
          ))}
      </div>
    </div>
  );
}
