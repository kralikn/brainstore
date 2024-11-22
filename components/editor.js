'use client'

import { $createTextNode, $getRoot, $getSelection, CLEAR_HISTORY_COMMAND } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { $createHeadingNode, HeadingNode } from '@lexical/rich-text';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import ToolbarPlugin from '@/plugins/toolbar';
import { createContext, createNote } from '@/utils/actions';
import { Input } from './ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { CloudUpload, Loader2, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';


const theme = {
  heading: {
    h1: 'text-4xl',
    h2: 'text-3xl',
    h3: 'text-2xl'
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    strikethrough: 'line-through',
    underline: 'underline',
  },
}
function onError(error) {
  console.error(error);
}
function MyOnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
}
const initialConfig = {
  namespace: 'NoteEditor',
  theme,
  onError,
  nodes: [HeadingNode]
}

const noteSchema = z.object({
  noteTitle: z.string().min(6, {
    message: "Legalább 6 karakter legyen a jegyzet címe"
  }),
})

export default function Editor({ topicSlug }) {


  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [noteTitle, setNoteTitle] = useState('')
  const [editorState, setEditorState] = useState()
  const [errors, setErrors] = useState([])


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

  const EditorActions = (noteTitle) => {
    const [editor] = useLexicalComposerContext()


    const handleSaveNote = async () => {

      const result = noteSchema.safeParse(noteTitle)
      if (result.success) {
        setErrors([])
        editor.update(async () => {
          const editorState = editor.getEditorState()
          const json = editorState.toJSON()
          const editorJSON = JSON.stringify(json)
          mutate({ editorJSON, noteTitle, topicSlug })
        })
      } else {
        setErrors(result.error.formErrors.fieldErrors.noteTitle);
      }
    }

    const handleReset = async () => {
      const editorState = editor.getEditorState()
      editor.update(() => {
        $getRoot().clear()
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined)
      })
    }
    return <div className='space-x-4 pt-4'>
      <Button onClick={handleSaveNote} disabled={isPending}>
        {isPending ? <Loader2 className="animate-spin" /> : <CloudUpload />}Mentés
      </Button>
      <Button onClick={handleReset} disabled={isPending}>
        <Trash2 />Törlés
      </Button>
    </div>
  }

  const onChange = (editorState) => {
    // Call toJSON on the EditorState object, which produces a serialization safe string
    const editorStateJSON = editorState.toJSON();
    // However, we still have a JavaScript object, so we need to convert it to an actual string with JSON.stringify
    setEditorState(JSON.stringify(editorStateJSON));
  }

  return (
    <div className='col-span-6 flex flex-col items-start gap-2'>
      <div className='w-full mb-2'>
        <Input
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="A jegyzeted címe..."
        />
        {errors.length > 0 && <Alert variant="destructive" className='border-none p-0 pl-3 py-2 '>
          <AlertDescription className='text-xs'>{errors[0]}</AlertDescription>
        </Alert>}
      </div>
      <div className='relative w-full h-full'>
        <LexicalComposer initialConfig={initialConfig}>
          {/* <MyHeadingPlugin /> */}
          <div className='mb-2'>
            <ToolbarPlugin />
          </div>
          <RichTextPlugin
            contentEditable={<ContentEditable className='w-full min-h-[calc(100vh-30rem)] max-h-[calc(100vh-23.75rem)] overflow-y-auto border rounded-md p-4' />}
            // placeholder={<div className='absolute top-14 left-4 text-gray-400'>Írj valami okosat0...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <MyOnChangePlugin onChange={onChange} />
          <EditorActions noteTitle={noteTitle} />
        </LexicalComposer>
      </div>
    </div>
  );
}
