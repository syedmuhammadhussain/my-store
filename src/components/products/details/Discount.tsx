import { Dot } from "lucide-react";

export default function ProductDiscount({
  discount_price,
  price,
  showAmount = true,
  variant,
}: {
  discount_price: number | null | undefined;
  price: number | null;
  showAmount?: boolean;
  variant?: "one" | "two";
}) {
  if (discount_price == null || price == null || discount_price >= price)
    return null;

  const amountOff = Number(price) - Number(discount_price);
  const percentOff = Math.round((amountOff / Number(price)) * 100);

  if (variant && variant === "one")
    return (
      <div className="flex flex-col mt-1">
        <span className="text-red-600 text-[13px] font-normal py-0.5 rounded tracking-widest">
          {showAmount
            ? ` Save up to Rs.${amountOff.toFixed(2)}`
            : `${percentOff}% OFF`}
        </span>
      </div>
    );

  if (variant && variant === "two") {
    return (
      <div className="inline-flex items-center bg-red-600 text-[12px] text-white font-normal px-2 rounded tracking-widest">
        {`Save `}
        <Dot />
        {` Rs.${amountOff.toFixed(2)}`}
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-1">
      <span className="text-red-600 text-[13px] font-normal py-0.5 rounded tracking-widest">
        {showAmount
          ? ` Save up to Rs.${amountOff.toFixed(2)}`
          : `${percentOff}% OFF`}
      </span>
    </div>
  );
}
