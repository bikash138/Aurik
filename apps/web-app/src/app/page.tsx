import Footer from "@/components/Footer";
import { FAQ } from "@/components/home/FAQ";
import { Features } from "@/components/home/Features";
import { Hero } from "@/components/home/Hero";
import { Navbar } from "@/components/home/Navbar";
import { Usage } from "@/components/home/Usage";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Usage />

      <Features />
      <FAQ />

      <Footer />
    </div>
  );
}
