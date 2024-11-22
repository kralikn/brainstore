import { Skeleton } from "./ui/skeleton";

export default function LoadingNotes() {
  return (
    <div className="col-span-6">
      <Skeleton className="h-2/6 rounded-md bg-gray-200" />
    </div>
  )
}
