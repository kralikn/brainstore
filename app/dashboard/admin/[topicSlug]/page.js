import DocsList from "@/components/docs-list";
import FileUpload from "@/components/file-upload";
import LoadingDocsListPage from "@/components/loading-docs-list-page";
import { getFiles } from "@/utils/actions"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Suspense } from "react"

const queryClient = new QueryClient()

async function Docs({ topicSlug }) {
  await queryClient.prefetchQuery({
    queryKey: ['topic', topicSlug],
    queryFn: () => getFiles(topicSlug),
  });
  return (
    <>
      <FileUpload topicSlug={topicSlug} />
      <DocsList topicSlug={topicSlug} />
    </>
  )
}

export default async function TopicPage({ params }) {
  const { topicSlug } = await params

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<LoadingDocsListPage />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Docs topicSlug={topicSlug} />
        </HydrationBoundary>
      </Suspense>
      {/* <DocsList topicSlug={topicSlug} /> */}
    </div>
  )
}