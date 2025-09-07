"use client";

import { useState, useMemo, useEffect } from "react";
import { Star, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useCartStore } from "@/stores/useCartStore";

import type { Swiper as SwiperType } from "swiper";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import SliderArrowButtonsSwiper from "@/components/cart/CartSliderArrowButtons";
import QuickButton from "@/components/QuickButton";
import ProductImage from "@/components/ProductImage";
import SizeSelector from "@/components/products/details/SizeSelector";
import ProductDiscount from "@/components/products/details/Discount";
import CartDrawer from "@/components/cart/CartDrawer";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

import "swiper/css";
import "swiper/css/navigation";

import StrapiService from "@/lib/strapi.service";
import { ProductAttributes } from "@/types/product";
import { calculateAverageRating } from "@/lib/utils";

type QuickViewDrawerProps = {
  slug: string | undefined;
};

// Reusable fade/slide variant
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.35, ease: "easeOut" },
  }),
};

export default function QuickViewDrawer({ slug }: QuickViewDrawerProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [swiperApi, setSwiperApi] = useState<SwiperType | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<ProductAttributes | null>(null);

  // ** Cart Store
  const addToCart = useCartStore((state) => state.addItem);

  const variants = useMemo(() => {
    return (
      product?.product_colors?.flatMap((color: any) =>
        color.variants?.map((v: any) => ({
          documentId: v.documentId,
          id: v.id,
          size: v.size || { label: "" },
          inventory: v.inventory,
          sku: v.sku
        }))
      ) ?? []
    );
  }, [product]);

  // Compute first available size
  const firstAvailableSize = useMemo(() => {
    return (
      variants.find((v) => (v.inventory?.quantity ?? 0) > 0)?.documentId || null
    );
  }, [variants]);

  // Check if all sizes are out of stock
  const allOutOfStock = useMemo(() => {
    return variants.every((v) => (v.inventory?.quantity ?? 0) <= 0);
  }, [variants]);

  // Auto-select first available size when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(firstAvailableSize);
    }
  }, [product, firstAvailableSize]);

  const selectedVariant = variants.find((v) => v.documentId === selectedSize);
  const quantity = selectedVariant?.inventory?.quantity ?? 0;

  // Stock status logic
  const stockStatus = useMemo(() => {
    if (quantity <= 0)
      return {
        text: "Out of stock",
        color: "text-red-600",
        bgColor: "bg-red-600",
      };
    if (quantity === 1)
      return {
        text: "Only 1 left in stock",
        color: "text-orange-500",
        bgColor: "bg-orange-5000",
      };
    if (quantity <= 5)
      return {
        text: "Only a few left in stock",
        color: "text-orange-500",
        bgColor: "bg-orange-5000",
      };
    return {
      text: "Item is in stock",
      color: "text-green-600",
      bgColor: "bg-green-600",
    };
  }, [quantity]);

  const handleQuickBuy = async () => {
    debugger
    setLoading(true);
    try {
      const res = await StrapiService.getSmallDetailProductBySlug(slug ?? "");
      const prod = res.data?.[0];
      if (prod) {
        setProduct(prod as ProductAttributes);
        setOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const title = product?.name ?? "";
  const price = product?.price ?? 0;
  const displayPrice = product?.discount_price ?? price;
  const showOldPrice =
    product?.discount_price != null &&
    price != null &&
    product?.discount_price < price;
  const description = product?.description ?? "";
  const images =
    product?.product_colors?.flatMap((color: any) =>
      color.images?.map((img: any) => img.formats?.small?.url)
    ) ?? [];
  const { average } = calculateAverageRating(product?.reviews || []);

  const handleAddToCart = () => {
    setLoading(true);
    if (!selectedVariant) return;

    addToCart({
      productId: product?.id ?? 0,
      variantId: selectedVariant.id,
      name: product?.name ?? "",
      price: displayPrice,
      image: images[0],
      size: selectedVariant.size.label,
      quantity: 1,
      slug: product?.slug ?? "",
      sku: selectedVariant.sku,
    });

    // Optionally open Cart Drawer
    setTimeout(() => {
      setOpen(false);
      setLoading(false);
      setCartOpen(true);
    }, 300);
  };

  return (
    <>
      <Drawer
        direction="right"
        open={open}
        onOpenChange={(isOpen) => setOpen(isOpen)}
      >
        <QuickButton loading={loading} onClick={handleQuickBuy} />
        <DrawerContent className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg">
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {/* DrawerHeader */}
            <DrawerHeader className="px-5 py-4 flex justify-between flex-row">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={0}
                className="w-full"
              >
                <motion.div variants={fadeUp} custom={0}>
                  <DrawerTitle className="text-xl font-bold mb-1 pr-5">
                    {title}
                  </DrawerTitle>
                </motion.div>

                {/* Price + Rating */}
                <motion.div
                  className="flex justify-between gap-3 mb-2"
                  variants={fadeUp}
                  custom={1}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-normal">
                      Rs.{displayPrice?.toFixed(2)}
                    </span>
                    {showOldPrice && (
                      <span className="text-gray-500 line-through">
                        Rs.{price?.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {average ? (
                    <div className="flex items-center gap-1">
                      <Star
                        className="w-3 h-3 text-black fill-black"
                        strokeWidth={2}
                      />
                      <span className="text-md">{average}</span>
                    </div>
                  ) : null}
                </motion.div>

                {/* Discount */}
                {product?.discount_price && (
                  <motion.div variants={fadeUp} custom={2}>
                    <ProductDiscount
                      discount_price={product?.discount_price}
                      price={price}
                      variant="two"
                    />
                  </motion.div>
                )}
              </motion.div>

              {/* Close */}
              <DrawerClose asChild>
                <Button
                  variant="default"
                  className="size-6 rounded text-black shadow-none bg-transparent hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </Button>
              </DrawerClose>
            </DrawerHeader>

            {/* Images */}
            <motion.div
              className="relative group pl-5 py-4 overflow-hidden"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
            >
              <Swiper
                modules={[Navigation]}
                onSwiper={(swiper) => setSwiperApi(swiper)}
                loop
                slidesPerView={1.2}
                spaceBetween={12}
                className="w-full h-80 group overflow-hidden"
              >
                {images.map((src, idx) => (
                  <SwiperSlide key={idx}>
                    <ProductImage
                      animation="none"
                      src={src || ""}
                      title={title}
                      imageClass="cursor-hand"
                    />
                  </SwiperSlide>
                ))}
                <SliderArrowButtonsSwiper
                  swiperApi={swiperApi}
                  canPrev
                  canNext
                  view="onHover"
                />
              </Swiper>

              {/* Stock Status with Animation */}
              <AnimatePresence mode="wait">
                {selectedSize && (
                  <motion.p
                    key={stockStatus.text}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.25 }}
                    className={`flex items-center mt-3 text-sm font-medium ${stockStatus.color}`}
                  >
                    <span className="relative flex size-2 mr-2">
                      <span
                        className={`absolute inline-flex h-full w-full animate-ping rounded-full ${stockStatus.bgColor} opacity-75`}
                      ></span>
                      <span
                        className={`relative inline-flex size-2 rounded-full ${stockStatus.bgColor}`}
                      ></span>
                    </span>
                    {stockStatus.text}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Sizes */}
            <motion.div
              className="px-5 pb-4"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={4}
            >
              <SizeSelector
                selectedId={selectedSize ?? ""}
                variants={variants}
                onSelect={(id) => setSelectedSize(id)}
              />
              <motion.p
                className="text-base text-gray-600 leading-relaxed"
                variants={fadeUp}
                custom={5}
              >
                {description}
              </motion.p>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            className="px-5 py-2 bg-white text-center relative"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={6}
          >
            <div className="pointer-events-none absolute -top-6 left-0 w-full h-8 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
            <motion.div className="flex mb-2" variants={fadeUp} custom={7}>
              {allOutOfStock ? (
                <Button
                  size="lg"
                  className="flex-auto bg-gray-400 text-white text-sm uppercase rounded h-10 cursor-not-allowed
                  hover:scale-[1.02] transition-transform"
                  disabled
                >
                  Out of Stock
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="flex-auto bg-black text-white text-sm uppercase rounded h-10 hover:scale-[1.02] transition-transform"
                  disabled={quantity <= 0}
                  onClick={handleAddToCart}
                  data-added={false}
                >
                  {loading ? (
                    <Spinner variant="ellipsis" />
                  ) : quantity <= 0 ? (
                    "Unavailable"
                  ) : (
                    "Add to Cart"
                  )}
                </Button>
              )}
            </motion.div>

            {/* Progressive enhancement (noscript) */}
            {/* <noscript>
            <form method="POST" action="/cart/add" className="mt-2">
              <input
                type="hidden"
                name="productId"
                value={product?.documentId ?? ""}
              />
              <input
                type="hidden"
                name="variantId"
                value={selectedSize ?? ""}
              />
              <input type="hidden" name="quantity" value="1" />
              <button className="w-full bg-black text-white py-2 text-sm uppercase rounded">
                Add to Cart
              </button>
            </form>
          </noscript> */}

            <motion.div variants={fadeUp} custom={8}>
              <Link href={`/products/${slug}`} className="text-sm underline">
                View Details
              </Link>
            </motion.div>
          </motion.div>
        </DrawerContent>
      </Drawer>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
