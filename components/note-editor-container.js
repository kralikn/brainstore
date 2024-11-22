'use client'

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { HeadingNode } from '@lexical/rich-text';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import ToolbarPlugin from '@/plugins/toolbar';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { useEffect, useState } from 'react';
import EditorActionsComponens from './editor-actions';


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
const onError = (error) => {
  console.error(error);
}
const initialConfig = {
  namespace: 'NoteEditor',
  theme,
  onError,
  nodes: [HeadingNode]
}

const MyOnChangePlugin = ({ onChange }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
}

export default function NoteEditorContainer({ topicSlug }) {

  const [noteTitle, setNoteTitle] = useState('')
  const [editorState, setEditorState] = useState()
  const [errors, setErrors] = useState([])


  const onChange = (editorState) => {
    const editorStateJSON = editorState.toJSON();
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
      <LexicalComposer initialConfig={initialConfig}>
        <div className='w-full'>
          <div className='mb-2'>
            <ToolbarPlugin />
          </div>
          <RichTextPlugin
            contentEditable={<ContentEditable className='w-full min-h-[calc(100vh-30rem)] max-h-[calc(100vh-23.75rem)] overflow-y-auto border rounded-md p-4' />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <MyOnChangePlugin onChange={onChange} />
          <EditorActionsComponens
            noteTitle={noteTitle}
            topicSlug={topicSlug}
            setNoteTitle={setNoteTitle}
            setErrors={setErrors}
          />
        </div>
      </LexicalComposer>
    </div>
  )
}
