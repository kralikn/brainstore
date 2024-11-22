'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteNote } from "@/utils/actions"
import { FilePenLine, FileStack, Loader2, StickyNote, Trash2 } from "lucide-react"
import { Button } from "./ui/button"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import Link from "next/link"
import { TooltipContent } from "@radix-ui/react-tooltip"
import { Badge } from "./ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"



export default function NotesListItem({ note, topicSlug, }) {

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate, isPending: deleteIsPending } = useMutation({
    mutationFn: (values) => deleteNote(values),
    onSuccess: (data) => {
      if (!data) {
        toast({
          variant: "destructive",
          description: 'Valami hiba történt...',
        });
        return;
      }
      toast({ description: data.message })
      queryClient.invalidateQueries({ queryKey: ['notes', topicSlug] })
    },
  })

  const handleDeleteNote = () => {
    mutate(note.id)
  }

  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex gap-3 items-center">
        {/* <SquarePen size={18} /> */}
        <StickyNote size={18} />
        <div className="">{note.title}</div>
      </div>
      <div className="space-x-2">
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger> */}
        <Button size='sm' variant="" disabled={deleteIsPending}>
          {false ? <Loader2 className="animate-spin" /> : <FileStack />}
        </Button>
        {/* </TooltipTrigger>
            <TooltipContent side='top' sideOffset={10}>
              <Badge variant="" className="px-3 py-1">Feldolgozás</Badge>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}

        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger> */}
        <Button asChild size="sm" variant="">
          <Link href={`/dashboard/admin/${topicSlug}/notes/${note.id}`}>
            <FilePenLine />
          </Link>
        </Button>
        {/* </TooltipTrigger>
            <TooltipContent side='top' sideOffset={10}>
              <Badge variant="" className="px-3 py-1">Szerkesztés</Badge>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}

        <Button variant="destructive" size="sm" onClick={handleDeleteNote} disabled={deleteIsPending}>
          {deleteIsPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
        </Button>
      </div>
    </div>
  )
}
