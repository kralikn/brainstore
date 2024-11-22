'use client'

import Link from "next/link"
import { Button } from "./ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { deleteTopic } from "@/utils/actions"
import { FilePlus, FilePlus2, Loader2, MessageSquareMore, Pencil, SquarePen, Trash2 } from "lucide-react"
import { Badge } from "./ui/badge"
import { Tooltip, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { TooltipContent } from "@radix-ui/react-tooltip"

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
        <div className="space-x-4">
          <Badge variant="secondary" className="px-3 py-1">{`${topic.doc_count ? topic.doc_count : '0'} dokumentum`}</Badge>
          <Badge variant="secondary" className="px-3 py-1">{`${topic.note_count ? topic.note_count : '0'} jegyzet`}</Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-4">

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button asChild size='sm'>
                  <Link href={`/dashboard/admin/${topic.folder_name}/documents`}>
                    {/* <Link href={`/dashboard/admin/documents/${topic.folder_name}`}> */}
                    <FilePlus2 />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top' sideOffset={10}>
                <Badge variant="" className="px-3 py-1">Dokumentum hozzáadása</Badge>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button asChild size='sm'>
                  <Link href={`/dashboard/admin/${topic.folder_name}/notes`}>
                    {/* <Link href={`/dashboard/admin/notes/${topic.folder_name}`}> */}
                    <SquarePen />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top' sideOffset={10}>
                <Badge variant="" className="px-3 py-1">Jegyzet hozzáadása</Badge>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {(topic.has_doc_embedded || topic.has_note_embedded) && <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/admin/chat/${topic.id}`}>
                    <MessageSquareMore />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top' sideOffset={10}>
                <Badge variant="" className="px-3 py-1">Chat</Badge>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>}
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size='sm' variant="destructive" onClick={() => handleSubmit(topic)} disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side='top' sideOffset={10}>
              <Badge variant="destructive" className="px-3 py-1">Törlés</Badge>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

      </CardFooter>
    </Card>
  )
}
