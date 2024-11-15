import { Skeleton } from "./ui/skeleton";

export default function LoadingChat() {
  return (
    <div className='grid grid-cols-12 min-h-[calc(100vh-18rem)] gap-4'>
      <div className='col-span-7'>
        <Skeleton className="h-full w-full rounded-md bg-gray-200" />
      </div>
      <div className='col-span-5 h-full space-y-3'>
        <div className="h-10">
          <Skeleton className="h-full w-full rounded-md bg-gray-200" />
        </div>
        <div className="h-10">
          <Skeleton className="h-full w-full rounded-md bg-gray-200" />
        </div>
        <div className="h-10">
          <Skeleton className="h-full w-full rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  )
}
