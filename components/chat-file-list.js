'use client'

import { getFileListForChat } from "@/utils/actions"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import ChatFileItem from "./chat-file-item"
import LoadingChatFileList from "./loading-chat-file-list"

export default function ChatFileList({ topicId }) {


  const { data, isLoading, isPending } = useQuery({
    queryKey: ['chat', topicId],
    queryFn: () => getFileListForChat(topicId),
  })

  const docs = data?.docs || []
  const docsCount = data?.docsCount || 0

  if (isLoading || isPending) return <LoadingChatFileList />

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="">Források</CardTitle>
        <CardDescription>{`${docsCount} dokumentum`}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {docs.map(doc => {
          return <ChatFileItem key={doc.id} doc={doc} />
        })}
      </CardContent>
    </Card>
  )
}
