'use client'

import { $createTextNode, $getRoot, $getSelection } from 'lexical';
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
import { createContext } from '@/utils/actions';
import { Input } from './ui/input';

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
  namespace: 'MyEditor',
  theme,
  onError,
  nodes: [
    HeadingNode,
    // MyHeadingPlugin,
  ]
}


function MyHeadingPlugin() {
  const [editor] = useLexicalComposerContext();
  const onClick = (e) => {

    editor.update(() => {
      const root = $getRoot()
      root.append($createHeadingNode('h1').append($createTextNode('Hello World!')))
    })
  }

  return <Button onClick={onClick} >Heading</Button>
}
export default function Editor({ topicSlug }) {

  function SaveButton() {
    const [editor] = useLexicalComposerContext();
    const handleSave = async () => {
      editor.update(async () => {
        const editorState = editor.getEditorState()
        const json = editorState.toJSON()
        console.log(JSON.stringify(json));
        const editorJSON = JSON.stringify(json)
        await createContext({ editorJSON, noteTitle, topicSlug })
      })
    }

    return <Button className='mt-4' onClick={handleSave}>Mentés</Button>
  }

  const [noteTitle, setNoteTitle] = useState('');
  const [editorState, setEditorState] = useState();
  function onChange(editorState) {
    // Call toJSON on the EditorState object, which produces a serialization safe string
    const editorStateJSON = editorState.toJSON();
    // However, we still have a JavaScript object, so we need to convert it to an actual string with JSON.stringify
    setEditorState(JSON.stringify(editorStateJSON));
  }


  return (
    <div className='flex flex-col items-start gap-2 w-2/4'>
      <div className='w-full mb-2'>
        <Input
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="A jegyzeted címe..."
        />
      </div>
      <div className='relative w-full h-full'>
        <LexicalComposer initialConfig={initialConfig}>
          {/* <MyHeadingPlugin /> */}
          <div className='mb-2'>
            <ToolbarPlugin />
          </div>
          <RichTextPlugin
            contentEditable={<ContentEditable className='w-full min-h-[calc(100vh-28rem)] max-h-[calc(100vh-23.75rem)] overflow-y-auto border rounded-md p-4' />}
            // placeholder={<div className='absolute top-14 left-4 text-gray-400'>Írj valami okosat0...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <MyOnChangePlugin onChange={onChange} />
          <SaveButton />
        </LexicalComposer>
      </div>
    </div>
  );
}
