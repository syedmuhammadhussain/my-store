export default function ProductDiscount({
  discount_price,
  price,
  showAmount = true,
}: {
  discount_price: number | null | undefined;
  price: number | null;
  showAmount?: boolean;
}) {
  if (discount_price == null || price == null || discount_price >= price)
    return null;

  const amountOff = Number(price) - Number(discount_price);
  const percentOff = Math.round((amountOff / Number(price)) * 100);

  return (
    <div className="flex flex-col mt-1">
      <span className="text-red-600 text-[13px] font-normal py-0.5 rounded tracking-widest">
        {showAmount ? ` Save up to Rs.${amountOff.toFixed(2)}` : `${percentOff}% OFF`}
      </span>
    </div>
  );
}
