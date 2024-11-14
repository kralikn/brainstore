import { Skeleton } from "./ui/skeleton";

export default function LoadingDocsListPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-35">
        <Skeleton className="h-full w-full rounded-md bg-gray-200" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center gap-3">
          <div className="h-10 w-3/5">
            <Skeleton className="h-full w-full rounded-md bg-gray-200" />
          </div>
          <div className="flex justify-between items-center gap-3 h-10 w-4/12">
            <Skeleton className="h-full w-full rounded-md bg-gray-200" />
            <Skeleton className="h-full w-full rounded-md bg-gray-200" />
            <Skeleton className="h-full w-full rounded-md bg-gray-200" />
          </div>
        </div>
        <div className="flex justify-between items-center gap-3">
          <div className="h-10 w-3/5">
            <Skeleton className="h-full w-full rounded-md bg-gray-200" />
          </div>
          <div className="flex justify-between items-center gap-3 h-10 w-4/12">
            <Skeleton className="h-full w-full rounded-md bg-gray-200" />
            <Skeleton className="h-full w-full rounded-md bg-gray-200" />
            <Skeleton className="h-full w-full rounded-md bg-gray-200" />
          </div>
        </div>
        <div className="flex justify-between items-center gap-3">
          <div className="h-10 w-3/5">
            <Skeleton className="h-full w-full rounded-md bg-gray-200" />
          </div>
          <div className="flex justify-between items-center gap-3 h-10 w-4/12">
            <Skeleton className="h-full w-full rounded-md bg-gray-200" />
            <Skeleton className="h-full w-full rounded-md bg-gray-200" />
            <Skeleton className="h-full w-full rounded-md bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  )
}
