import { AnnouncementBar } from "../home/AnnouncementBar";
import MainNav from "./MainNav";
import MobileNavServer from "../navigation/MobileNavServer";

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
      <MobileNavServer />
    </>
  );
}
