// // components/ProductCard.tsx
// import Image from "next/image";
// import { ShoppingCart } from "lucide-react";
// import { Rating } from "../Rating";

// interface Slide {
//   id: number | string;
//   src?: string;
//   secSrc?: string;
//   title: string;
//   price: string;
//   href: string;
//   rating?: number;
//   oldPrice?: string;
//   discount?: string;
//   [key: string]: any;
// }

// export default function SingleProductCard({
//   id,
//   src,
//   secSrc,
//   title,
//   price,
//   rating,
//   oldPrice,
//   discount,
// }: Slide) {
//   return (
//     <div key={id} className="group flex-shrink-0 w-full px-1">
//       <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-xs">
//         <Image
//           src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${src}` || ""}
//           alt={title}
//           fill
//           className="object-cover"
//           sizes="(min-width: 768px) 100vw"
//         />
//         <Image
//           src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${secSrc}` || ""}
//           alt={title}
//           fill
//           sizes="(min-width: 768px) 100vw"
//           className="object-cover absolute inset-0 translate-x-full opacity-0 transition-transform duration-600 ease-in-out group-hover:translate-x-0 group-hover:opacity-100"
//         />
//         <button
//           aria-label="Quick Buy"
//           className="hidden md:flex quickBuyBtn absolute bottom-5 right-5 items-center justify-center bg-white text-gray-900 rounded-sm w-10 h-10 opacity-0 translate-y-4 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 hover:w-32 hover:px-3"
//         >
//           <ShoppingCart className="h-5 w-5" />
//           <span className="ml-0 w-0 whitespace-nowrap opacity-0 transition-all duration-200 ease-in">
//             Quick Buy
//           </span>
//         </button>
//       </div>

//       <div className="mt-2">
//         <div className="md:flex flex-wrap items-center space-x-2">
//           <h3 className="text-base font-bold text-gray-900">{title}</h3>
//           <div className="flex items-baseline space-x-2">
//             <span>{price}</span>
//             {discount && (
//               <span className="hidden md:block text-gray-400 line-through">
//                 {oldPrice}
//               </span>
//             )}
//           </div>
//         </div>
//         {discount && (
//           <div className="hidden md:block mb-2">
//             <span className="text-sm text-red-600">{discount}</span>
//           </div>
//         )}
//         {rating && <Rating rating={rating} size="w-3 h-3" />}
//       </div>
//     </div>
//   );
// }
