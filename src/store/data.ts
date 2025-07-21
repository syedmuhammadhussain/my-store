interface Slide {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  title: string;
  subtitle?: string;
}

export const heroData: Slide[] = [
  {
    desktopSrc:
      "https://snoozoff.com/cdn/shop/files/Best_kids_Collecton_in_Pakistan.jpg?v=1742209251&width=1640",
    mobileSrc:
      "https://snoozoff.com/cdn/shop/files/Kids_Collecton.jpg?v=1742209369&width=738",
    alt: "Kids Collection",
    title: "Welcome to Our Site",
    subtitle: "Discover awesome features",
  },
  {
    desktopSrc:
      "https://snoozoff.com/cdn/shop/files/Best_Menswea_Collection.webp?v=1741604192&width=1640",
    mobileSrc:
      "https://snoozoff.com/cdn/shop/files/T_shirt_Pajama_Set_for_Men.webp?v=1741690360&width=738",
    alt: "Menswear Collection",
    title: "Built with Tailwind CSS",
    subtitle: "Utility-first styling",
  },
  {
    desktopSrc:
      "https://snoozoff.com/cdn/shop/files/Hues_of_Spring_4.jpg?v=1750849578&width=1640",
    mobileSrc:
      "https://snoozoff.com/cdn/shop/files/WhatsApp_Image_2025-06-24_at_11.45.56_AM.jpg?v=1750849536&width=738",
    alt: "Spring Collection",
    title: "SEO-Friendly SSR",
    subtitle: "Fast initial paint",
  },
];

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Care Plans", href: "/care-plans" },
  { label: "Learn", href: "/learn" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const slides = [
    {
      title: "Product 1",
      src: "/images/products/Geometric-Spring-7.jpg",
      secSrc: "/images/products/Geometric-Spring-5.jpg",
      alt: "Light-patterned pajama",
      id: 1,
      price: "Rs.1229.99",
      href: "/product1",
      rating: 4.5,
      oldPrice: "Rs.1239.99",
      discount: "25% off",
    },
    {
      title: "Product 2",
      src: "/images/products/Paul_4.jpeg",
      secSrc: "/images/products/Paul_1.jpeg",
      alt: "Blue tee & checkered shorts",
      id: 2,
      price: "Rs.1229.99",
      href: "/product2",
      rating: 3.5,
      oldPrice: "Rs.1239.99",
      discount: "25% off",
    },
    {
      title: "Product 3",
      src: "/images/products/Sam.jpeg",
      secSrc: "/images/products/Sam_3.jpeg",
      alt: "White tee & dark shorts",
      id: 3,
      price: "Rs.1229.99",
      href: "/product3",
      rating: 4.5,
      oldPrice: "Rs.1239.99",
      discount: "25% off",
    },
    {
      title: "Product 4",
      src: "/images/products/Snoozeoff0321.jpeg",
      secSrc: "/images/products/Secret-Garden.jpg",
      alt: "White tee & dark shorts",
      id: 4,
      price: "Rs.1229.99",
      href: "/product4",
      rating: 4.5,
      oldPrice: "Rs.1239.99",
      discount: "25% off",
    },
    {
      title: "Product 5",
      src: "/images/products/SnuggleBear.jpg",
      secSrc: "/images/products/SnuggleBear1.jpg",
      alt: "White tee & dark shorts",
      id: 5,
      price: "Rs.1229.99",
      href: "/product5",
      rating: 4.5,
      oldPrice: "Rs.1239.99",
      discount: "25% off",
    },
    {
      title: "Product 6",
      src: "/images/products/Taffy_Navy_Pajama_Sets.jpg",
      secSrc: "/images/products/Taffy_Navy_Pajama_Set.jpg",
      alt: "White tee & dark shorts",
      id: 6,
      price: "Rs.1229.99",
      href: "/product6",
      rating: 3.5,
      oldPrice: "Rs.1239.99",
      discount: "25% off",
    },
  ];