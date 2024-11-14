import ChatContainer from '@/components/chat-container';
import ChatPageHeader from '@/components/chat-page-header';
import LoadingChatPage from '@/components/loading-chat-page';
import { getFileListForChat } from '@/utils/actions'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Suspense } from 'react';

const queryClient = new QueryClient()

async function Chat({ topicId }) {
  await queryClient.prefetchQuery({
    queryKey: ['chat', topicId],
    queryFn: () => getFileListForChat(topicId),
  });
  return (
    <>
      <ChatPageHeader topicId={topicId} />
      <ChatContainer topicId={topicId} />
    </>
  )
}

export default async function ChatPage({ params }) {

  const { topicId } = await params

  return (
    <div className="flex flex-col gap-4" >
      <Suspense fallback={<LoadingChatPage />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Chat topicId={topicId} />
        </HydrationBoundary>
      </Suspense>
    </div>
  )
}
