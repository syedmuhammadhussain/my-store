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
          srcSet="https://snoozoff.com/cdn/shop/files/Best_kids_Collecton_in_Pakistan.jpg?v=1742209251&width=1640"
        />
        <source
          media="(max-width: 767px)"
          srcSet="https://snoozoff.com/cdn/shop/files/Best_kids_Collecton_in_Pakistan.jpg?v=1742209251&width=700"
        />
        <img
          src="https://snoozoff.com/cdn/shop/files/Best_kids_Collecton_in_Pakistan.jpg?v=1742209251&width=1640"
          alt="Kids"
          className="object-cover w-full h-full"
        />
      </picture>
      {children}
    </div>
  );
}
