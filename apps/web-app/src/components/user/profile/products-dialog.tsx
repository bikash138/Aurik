"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Grid3X3 } from "lucide-react";

const MOCK_PRODUCTS = [
  { name: "Aurik Drive", icon: "💾" },
  { name: "Aurik Mail", icon: "✉️" },
  { name: "Aurik Meet", icon: "📹" },
  { name: "Aurik Docs", icon: "📄" },
  { name: "Aurik Maps", icon: "🗺️" },
  { name: "Aurik Pay", icon: "💳" },
];

export function ProductsDialog() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-full hover:bg-(--color-lime-tint) transition-colors outline-none">
          <Grid3X3 className="w-6 h-6 text-(--color-text-body)" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-(--color-page-bg-deep) border-(--color-border) p-3"
      >
        <p className="text-xs font-medium text-muted px-1 mb-2">
          Aurik Products
        </p>
        <div className="grid grid-cols-3 gap-1">
          {MOCK_PRODUCTS.map((product) => (
            <button
              key={product.name}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-(--color-lime-tint) transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-(--color-lime-tint) flex items-center justify-center text-xl">
                {product.icon}
              </div>
              <span className="text-xs text-(--color-text-body) text-center leading-tight">
                {product.name}
              </span>
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
