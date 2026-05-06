import Footer from "@/components/Footer";
import { Hero } from "@/components/home/Hero";
import { Navbar } from "@/components/home/Navbar";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* FEATURE GRID PREVIEW */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-8 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary font-bold">
              1
            </div>
            <h3 className="text-h3">Secure by Design</h3>
            <p className="text-sm text-muted-foreground">
              PKCE, OIDC, and OAuth 2.0 compliant out of the box. Your users'
              data is in safe hands.
            </p>
          </div>
          <div className="card p-8 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary font-bold">
              2
            </div>
            <h3 className="text-h3">Developer First</h3>
            <p className="text-sm text-muted-foreground">
              Clean APIs, comprehensive docs, and a dashboard that doesn't get
              in your way.
            </p>
          </div>
          <div className="card p-8 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary font-bold">
              3
            </div>
            <h3 className="text-h3">Scalable Infrastructure</h3>
            <p className="text-sm text-muted-foreground">
              Built to handle millions of requests. Scale from side projects to
              enterprise apps.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
