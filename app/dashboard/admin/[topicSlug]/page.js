import DocsList from "@/components/docs-list";
import FileUpload from "@/components/file-upload";
import LoadingDocsList from "@/components/loading-docs-list";
import LoadingDocsListHeader from "@/components/loading-docs-list-header";
import { getFiles } from "@/utils/actions"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Suspense } from "react"

const queryClient = new QueryClient()

async function DocsListFunction({ topicSlug }) {
  await queryClient.prefetchQuery({
    queryKey: ['topic', topicSlug],
    queryFn: () => getFiles(topicSlug),
  });
  return (
    <>
      <DocsList topicSlug={topicSlug} />
    </>
  )
}
async function FileUploadFunction({ topicSlug }) {
  await queryClient.prefetchQuery({
    queryKey: ['topic', topicSlug],
    queryFn: () => getFiles(topicSlug),
  });
  return (
    <>
      <FileUpload topicSlug={topicSlug} />
    </>
  )
}

export default async function TopicPage({ params }) {
  const { topicSlug } = await params

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<LoadingDocsListHeader />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <FileUploadFunction topicSlug={topicSlug} />
        </HydrationBoundary>
      </Suspense>
      <Suspense fallback={<LoadingDocsList />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <DocsListFunction topicSlug={topicSlug} />
        </HydrationBoundary>
      </Suspense>
      {/* <DocsList topicSlug={topicSlug} /> */}
    </div>
  )
}