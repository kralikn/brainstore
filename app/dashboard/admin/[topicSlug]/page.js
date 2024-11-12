import DocsList from "@/components/docs-list";
import FileUpload from "@/components/file-upload";
import { getFiles } from "@/utils/actions"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function TopicPage({ params }) {

  const queryClient = new QueryClient()

  const { topicSlug } = await params

  await queryClient.prefetchQuery({
    queryKey: ['topic', topicSlug],
    queryFn: () => getFiles(topicSlug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-4">
        <FileUpload topicSlug={topicSlug} />
        <DocsList topicSlug={topicSlug} />
      </div>
    </HydrationBoundary>
  )
}