import { ProductsDialog } from "./Products-Dialog";
import { ProfileDialog } from "./Profile-Dialog";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-(--color-border) bg-(--color-page-bg)/80 backdrop-blur-md">
      <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-heading tracking-wide">
          Aurik Account
        </h1>
        <div className="flex items-center gap-2">
          <ProductsDialog />
          <ProfileDialog />
        </div>
      </div>
    </header>
  );
}
