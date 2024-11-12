import NewTopicForm from "@/components/new-topic-form"
import TopicList from "@/components/topic-list"
import { getAllTopics } from "@/utils/actions"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

export default async function AdminPage() {

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['topics'],
    queryFn: () => getAllTopics(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-4">
        <NewTopicForm />
        <TopicList />
      </div>
    </HydrationBoundary>
  )
}