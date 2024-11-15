import ChatContainer from '@/components/chat-container';
import ChatPageHeader from '@/components/chat-page-header';
import LoadingChat from '@/components/loading-chat';
import LoadingChatPage from '@/components/loading-chat-page';
import LoadingChatPageHeader from '@/components/loading-chat-page-header';
import { getFileListForChat } from '@/utils/actions'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Suspense } from 'react';

const queryClient = new QueryClient()

async function ChatContainerFunction({ topicId }) {
  await queryClient.prefetchQuery({
    queryKey: ['chat', topicId],
    queryFn: () => getFileListForChat(topicId),
  });
  return (
    <>
      <ChatContainer topicId={topicId} />
    </>
  )
}
async function ChatPageHeaderFunction({ topicId }) {
  await queryClient.prefetchQuery({
    queryKey: ['chat', topicId],
    queryFn: () => getFileListForChat(topicId),
  });
  return (
    <>
      <ChatPageHeader topicId={topicId} />
    </>
  )
}

export default async function ChatPage({ params }) {

  const { topicId } = await params

  return (
    <div className="flex flex-col gap-4" >
      <Suspense fallback={<LoadingChatPageHeader />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ChatPageHeaderFunction topicId={topicId} />
        </HydrationBoundary>
      </Suspense>
      <Suspense fallback={<LoadingChat />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ChatContainerFunction topicId={topicId} />
        </HydrationBoundary>
      </Suspense>
    </div>
  )
}
