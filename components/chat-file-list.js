'use client'

import { getSouerceForChat } from "@/utils/actions"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import ChatFileItem from "./chat-file-item"
import LoadingChatFileList from "./loading-chat-file-list"
import { Separator } from "./ui/separator"
import ChatNoteItem from "./chat-note-item"

export default function ChatFileList({ topicId }) {


  const { data, isLoading, isPending } = useQuery({
    queryKey: ['chat', topicId],
    queryFn: () => getSouerceForChat(topicId),
    // queryFn: () => getSouerceForChat(topicId),
  })

  const docs = data?.docs || []
  const notes = data?.notes || []
  const docsCount = data?.docsCount || 0
  const notesCount = data?.notesCount || 0

  if (isLoading || isPending) return <LoadingChatFileList />

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="">Források</CardTitle>
        <div className="flex h-5 items-center space-x-4">
          <CardDescription>{`${docsCount} dokumentum`}</CardDescription>
          <Separator orientation="vertical" />
          <CardDescription>{`${notesCount} jegyzet`}</CardDescription>
        </div>
      </CardHeader>
      <Separator className="mb-6" />
      <CardContent className="space-y-6">
        {docs.map(doc => {
          return <ChatFileItem key={doc.id} doc={doc} />
        })}
      </CardContent>
      <Separator className="mb-6" />
      <CardContent className="space-y-6">
        {notes.map(note => {
          return <ChatNoteItem key={note.id} note={note} />
        })}
      </CardContent>
    </Card>
  )
}
