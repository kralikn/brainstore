import { Skeleton } from "./ui/skeleton";

export default function LoadingDocsListHeader() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-32">
        <Skeleton className="h-full w-full rounded-md bg-gray-200" />
      </div>
    </div>
  )
}
