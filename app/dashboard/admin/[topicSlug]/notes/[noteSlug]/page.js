import LoadingNotesListHeader from '@/components/loading-notes-list-header';
import NotesPageHeader from '@/components/notes-page-header';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Suspense } from "react"


const queryClient = new QueryClient()



export default async function EditNotePage({ params }) {

  const { topicSlug, noteSlug } = await params

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<LoadingNotesListHeader />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <NotesPageHeader topicSlug={topicSlug} url={`/dashboard/admin/${topicSlug}/notes`} subTitle="Jegyzet szerkesztése" />
        </HydrationBoundary>
      </Suspense>
    </div>
  )
}