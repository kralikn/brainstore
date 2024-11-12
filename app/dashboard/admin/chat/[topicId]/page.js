import ChatContainer from '@/components/chat-container';
import ChatPageHeader from '@/components/chat-page-header';
import { getFileListForChat } from '@/utils/actions'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

export default async function ChatPage({ params }) {

  const queryClient = new QueryClient()
  const { topicId } = await params
  await queryClient.prefetchQuery({
    queryKey: ['chat', topicId],
    queryFn: () => getFileListForChat(topicId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-4" >
        <ChatPageHeader topicId={topicId} />
        <ChatContainer topicId={topicId} />
      </div>
    </HydrationBoundary>
  )
}
