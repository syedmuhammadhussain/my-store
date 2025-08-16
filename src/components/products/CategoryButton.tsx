import Link from "next/link";
import { CategoryAttributes } from "@/types/category";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  subCategories: CategoryAttributes[];
  name: string;
  slug: string;
}

export default function CategoryButton({ subCategories, name, slug }: Props) {
  return (
    <div className="p-3 text-left justify-center md:my-6 hidden md:block">
      <h3 className="font-medium mb-5 text-xl md:text-3xl">{name}</h3>
      <div className="flex flex-wrap gap-2">
        {subCategories.map((cat, i) => (
          <Tooltip key={cat.slug}>
            <TooltipTrigger asChild>
              <Link
                href={cat.slug}
                className={`${
                  slug === cat.slug.toLowerCase()
                    ? "bg-black text-white cursor-not-allowed"
                    : "cursor-pointer hover:bg-black hover:text-white bg-trasparent"
                }
                text-xs md:text-sm uppercase flex-1 min-w-[120px] max-w-full
                px-3 py-2 font-medium text-center border-2 border-black shadow-none rounded-md
                transition-colors duration-200 text-black truncate
                motion-opacity-in-0 motion-translate-y-in-50 motion-blur-in-xs
                `}
                style={{
                  animationDelay: `${i * 60}ms`,
                  WebkitAnimationDelay: `${i * 60}ms`,
                }}
              >
                {cat.name}
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{cat.slug}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
