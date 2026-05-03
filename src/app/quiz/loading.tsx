import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex flex-col min-h-screen p-5 space-y-6">
      <Skeleton className="h-12 w-32 rounded-lg" />
      <div className="space-y-4 pt-10">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    </main>
  );
}
