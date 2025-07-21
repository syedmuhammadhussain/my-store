import { AnnouncementBar } from "./AnnouncementBar";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";

export default function Header() {
  const promos = [
    "🎉 50% off all plans – today only!",
    "🚚 Free shipping on orders over $50",
    "⭐️ New feature: 1-on-1 coaching now available",
  ];

  return (
    <>
      <AnnouncementBar messages={promos} />
      <MainNav />
      <MobileNav />
    </>
  );
}
