import { Skeleton } from "@/components/ui/skeleton";

export function ProfilePageSkeleton() {
  return (
    <main className="flex-1 flex flex-col items-center px-4 py-12 sm:py-16">
      <div className="flex flex-col items-center gap-5 w-full max-w-xl">
        {/* Avatar */}
        <Skeleton className="bg-(--color-border) w-24 h-24 sm:w-28 sm:h-28 rounded-full" />

        {/* Name & email */}
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="bg-(--color-border) h-8 sm:h-9 w-48 rounded" />
          <Skeleton className="bg-(--color-border) h-5 sm:h-6 w-56 rounded" />
        </div>

        {/* Search */}
        <Skeleton className="bg-(--color-border) w-full h-12 rounded-full mt-2" />

        {/* Quick links */}
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="bg-(--color-border) h-9 w-28 rounded-full" />
          ))}
        </div>
      </div>
    </main>
  );
}
