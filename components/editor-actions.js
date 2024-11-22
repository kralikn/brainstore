import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, CLEAR_HISTORY_COMMAND } from 'lexical';
import { createNote } from "@/utils/actions";
import { useToast } from "@/hooks/use-toast";
import { CloudUpload, Loader2, Trash2 } from "lucide-react";
import { z } from "zod";

const noteSchema = z.object({
  noteTitle: z.string().min(6, {
    message: "Legalább 6 karakter legyen a jegyzet címe"
  }),
})
export default function EditorActionsComponens({ noteTitle, topicSlug, setNoteTitle, setErrors }) {

  const [editor] = useLexicalComposerContext()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: (values) => createNote(values),
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
      setNoteTitle('')
      editor.update(() => {
        $getRoot().clear();
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
      });
    },
  })

  const handleSubmitNote = () => {
    const result = noteSchema.safeParse({ noteTitle })
    if (result.success) {
      setErrors([])
      const editorState = editor.getEditorState()
      const json = editorState.toJSON()
      const editorJSON = JSON.stringify(json)
      mutate({ editorJSON, noteTitle, topicSlug })

    } else {
      setErrors(result.error.formErrors.fieldErrors.noteTitle);
    }
  }

  const handleResetNote = async () => {
    editor.update(() => {
      $getRoot().clear()
      editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined)
    })
  }

  return (
    <div className="mt-4 space-x-4">
      <Button
        onClick={handleSubmitNote}
        disabled={isPending}
      >
        {isPending ? <Loader2 className="animate-spin" /> : <CloudUpload />}Mentés
      </Button>
      <Button
        onClick={handleResetNote}
        disabled={isPending}
      >
        {isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}Mégsem
      </Button>
    </div>
  )
}
