import { Skeleton } from "./ui/skeleton";

export default function LoadingChatFileList() {
  return (
    <div className='grid grid-cols-12 min-h-[calc(100vh-20rem)] gap-4'>
      <div className='col-span-12 h-full space-y-3'>
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
