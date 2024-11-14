'use client'

import { getAllTopics } from "@/utils/actions"
import TopicCard from "./topic-card"
import { useQuery } from "@tanstack/react-query"
import LoadingTopics from "./loading-topics"

export default function TopicList() {

  const { data, isRefetching } = useQuery({
    queryKey: ['topics'],
    queryFn: () => getAllTopics()
  })

  const topics = data || []

  if (isRefetching) return <LoadingTopics />

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {topics.map(topic => <TopicCard key={topic.id} topic={topic} />)}
    </div>
  )
}
