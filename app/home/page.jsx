import HeroSection from "@/app/_components/home/HeroSection";
import SectionsOverview from "@/app/_components/home/SectionsOverview";
import StatsSection from "@/app/_components/home/StatsSection";
import Testimonials from "@/app/_components/home/Testimonials";
import CTASection from "@/app/_components/home/CTASection";
import Header from "../layouts/partials/Header";
import Footer from "../layouts/partials/Footer";

export default function HomePage() {
  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
      <Header />
      <HeroSection />
      <SectionsOverview />
      <StatsSection />
      <CTASection />
      <Testimonials />
      <Footer />
    </main>
  );
}
