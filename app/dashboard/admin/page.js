import LoadingTopics from "@/components/loading-topics"
import NewTopicForm from "@/components/new-topic-form"
import TopicList from "@/components/topic-list"
import { getAllTopics } from "@/utils/actions"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Suspense } from "react"

const queryClient = new QueryClient()
async function Topics() {
  await queryClient.fetchQuery({
    queryKey: ['topics'],
    queryFn: () => getAllTopics(),
  })
  return <TopicList />
}

export default async function AdminPage() {

  return (
    <div className="flex flex-col gap-4">
      <NewTopicForm />
      <Suspense fallback={<LoadingTopics />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Topics />
        </HydrationBoundary>
      </Suspense>
    </div>
  )
}