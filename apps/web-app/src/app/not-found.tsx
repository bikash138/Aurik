import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="w-full max-w-[600px]">
        <div className="flex items-center gap-3 mb-6">
          <Image 
            src="/logo.svg" 
            alt="Aurik Logo" 
            width={40} 
            height={40} 
            className="w-10 h-10" 
          />
          <span
            className="text-[32px] font-bold tracking-tight"
            style={{ color: "#202124" }}
          >
            Aurik
          </span>
        </div>

        <div className="text-base leading-relaxed mb-8">
          <div className="font-bold mb-2" style={{ color: "#202124" }}>
            404. <span className="font-normal">That’s an error.</span>
          </div>
          <p style={{ color: "#70757a" }}>
            The requested URL was not found on this server.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 no-underline"
          style={{
            backgroundColor: "var(--color-lime)",
            color: "#000000",
          }}
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
