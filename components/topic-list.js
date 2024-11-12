'use client'

import { getAllTopics } from "@/utils/actions"
import TopicCard from "./topic-card"
import { useQuery } from "@tanstack/react-query"

export default function TopicList() {

  const { data, isPending } = useQuery({
    queryKey: ['topics'],
    queryFn: () => getAllTopics()
  })

  const topics = data || []

  console.log("topics on client: ", topics);

  if (isPending) return <h2 className='text-xl'>Kérlek várj...</h2>

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {topics.map(topic => <TopicCard key={topic.id} topic={topic} />)}
    </div>
  )
}
