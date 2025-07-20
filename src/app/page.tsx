// src/app/page.tsx
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        {/* …other sections */}
      </main>
    </>
  );
}
