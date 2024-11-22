import Editor from "@/components/editor";
import LoadingNotes from "@/components/loading-notes";
import LoadingNotesListHeader from "@/components/loading-notes-list-header";
import NoteEditorContainer from "@/components/note-editor-container";
import NotesList from "@/components/notes-list";
import NotesPageHeader from "@/components/notes-page-header";
import { getNotes } from "@/utils/actions"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Suspense } from "react"

const queryClient = new QueryClient()

async function NotesListFunction({ topicSlug }) {
  await queryClient.prefetchQuery({
    queryKey: ['notes', topicSlug],
    queryFn: () => getNotes(topicSlug),
  });
  return (
    <>
      <div className='col-span-6 flex flex-col items-start gap-2'>
        <NotesList
          topicSlug={topicSlug}
        />
      </div>
    </>
  )
}

export default async function NotesPage({ params }) {
  const { topicSlug } = await params

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<LoadingNotesListHeader />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <NotesPageHeader topicSlug={topicSlug} url={`/dashboard/admin`} subTitle="Jegyzetek hozzáadása" />
        </HydrationBoundary>
      </Suspense>
      <div className="grid grid-cols-12 gap-4">
        {/* <Editor topicSlug={topicSlug} /> */}
        <NoteEditorContainer topicSlug={topicSlug} />
        <Suspense fallback={<LoadingNotes />}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <NotesListFunction topicSlug={topicSlug} />
          </HydrationBoundary>
        </Suspense>
      </div>
    </div>
  )
}