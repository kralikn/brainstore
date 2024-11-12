'use client'

import Link from "next/link"
import { Button } from "./ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { deleteTopic } from "@/utils/actions"
import { MessageSquareMore, Pencil, Trash2 } from "lucide-react"
import { Badge } from "./ui/badge"

export default function TopicCard({ topic }) {

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: (topic) => deleteTopic(topic),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: 'Valami hiba történt...',
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['topics'] })
      toast({ description: data.message })
    },
  });

  const handleSubmit = (topic) => {
    mutate(topic)
  }

  return (
    <Card className="space-y-8">
      <CardHeader className="space-y-3 flex flex-col items-start">
        <CardTitle className="text-xl">{topic.title}</CardTitle>
        <Badge variant="secondary" className="px-3 py-1">{`${topic.doc_count ? topic.doc_count : '0'} dokumentum`}</Badge>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Button asChild size='sm'>
            <Link href={`/dashboard/admin/${topic.folder_name}`}>
              <Pencil /> Szerkesztés
            </Link>
          </Button>
          {topic.has_embedded && <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/admin/chat/${topic.id}`}>
              <MessageSquareMore size={32} />
              Chat
            </Link>
          </Button>}

        </div>
        <Button size='sm' variant="destructive" onClick={() => handleSubmit(topic)} disabled={isPending}>
          <Trash2 /> Törlés
        </Button>
      </CardFooter>
    </Card>
  )
}
