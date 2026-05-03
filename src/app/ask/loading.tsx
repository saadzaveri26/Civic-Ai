import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex flex-col h-screen p-5 space-y-6">
      <Skeleton className="h-12 w-full rounded-xl" />
      <div className="flex-1 space-y-4">
        <Skeleton className="h-20 w-3/4 rounded-2xl" />
        <div className="flex justify-end">
          <Skeleton className="h-16 w-1/2 rounded-2xl" />
        </div>
        <Skeleton className="h-24 w-2/3 rounded-2xl" />
      </div>
      <Skeleton className="h-16 w-full rounded-xl" />
    </main>
  );
}
