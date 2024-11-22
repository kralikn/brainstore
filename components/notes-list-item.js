'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteNote } from "@/utils/actions"
import { FilePenLine, FileStack, Loader2, SquarePen, Trash2 } from "lucide-react"
import { Button } from "./ui/button"
// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
// import { $getRoot, CLEAR_HISTORY_COMMAND } from 'lexical';

import { useToast } from "@/hooks/use-toast"


export default function NotesListItem({ note, topicSlug, setNoteTitle, setIsEditable }) {

  // const [editor] = useLexicalComposerContext()

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
      // setNoteTitle('')
      // setIsEditable(false)
      // editor.update(() => {
      //   $getRoot().clear();
      //   editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
      // });
    },
  })


  const handleEditNote = () => {
    // setNoteTitle(note.title)
    // const parsedEditorState = editor.parseEditorState(note.editor_json)
    // setIsEditable(true)
    // editor.setEditorState(parsedEditorState)
  }
  const handleDeleteNote = () => {
    mutate(note.id)
  }

  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex gap-3 items-center">
        <SquarePen size={18} />
        <div className="">{note.title}</div>
      </div>
      <div className="space-x-2">
        <Button size='sm' variant="" disabled={deleteIsPending}>
          {false ? <Loader2 className="animate-spin" /> : <FileStack />} Feldolgozás
        </Button>
        {/* <Button variant="" size="sm" onClick={handleEditNote} disabled={deleteIsPending}>
          <FilePenLine />
        </Button> */}
        <Button variant="destructive" size="sm" onClick={handleDeleteNote} disabled={deleteIsPending}>
          {deleteIsPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
        </Button>
      </div>
    </div>
  )
}
