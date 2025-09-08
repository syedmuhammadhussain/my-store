// ** Reusable Components
import Header from "@/components/main/Header";
import { FloatingSocial } from "@/components/main/FloatingSocial";
import { Footer } from "@/components/main/Footer";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <FloatingSocial />
    </>
  );
}
