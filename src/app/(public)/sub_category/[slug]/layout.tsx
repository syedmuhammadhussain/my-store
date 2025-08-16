// src/app/(public)/layout.tsx
// import "./../globals.css";

export const metadata = {
  title: "My Store",
  description: "Your one-stop shop for everything.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased bg-white">
      <picture className="w-full h-full">
        <source
          media="(min-width: 768px)"
          srcSet="/images/hero/inner-banner.webp"
        />
        <source
          media="(max-width: 767px)"
          srcSet="/images/hero/inner-banner.webp"
        />
        <img
          src="/images/hero/inner-banner.webp"
          alt="Kids"
          className="object-cover w-full h-full"
        />
      </picture>
      {children}
    </div>
  );
}
