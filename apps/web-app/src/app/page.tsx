import Footer from "@/components/footer";
import { FAQ } from "@/components/home/faq";
import { Features } from "@/components/home/features";
import { Hero } from "@/components/home/hero";
import { Navbar } from "@/components/home/navbar";
import { Usage } from "@/components/home/usage";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Separator className="max-w-5xl mx-auto opacity-70" />
      <Usage />
      <Separator className="max-w-5xl mx-auto opacity-70" />
      <Features />
      <Separator className="max-w-5xl mx-auto opacity-70" />
      <FAQ />
      <Footer />
    </div>
  );
}
