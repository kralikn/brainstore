/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $isRootOrShadowRoot,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $findMatchingParent } from '@lexical/utils';
import React from 'react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { Button } from '@/components/ui/button';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Heading, Heading1, Heading2, Heading3, Italic, RotateCcw, RotateCw, Strikethrough, Underline } from 'lucide-react';
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const LowPriority = 1;

// function Divider() {
//   return <Separator orientation="vertical mx-2" />
// }

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const activeBlock = useActiveBlock();

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, $updateToolbar]);

  function toggleBlock(type) {
    const selection = $getSelection();

    if (activeBlock === type) {
      return $setBlocksType(selection, () => $createParagraphNode());
    }

    if (type === 'h1') {
      return $setBlocksType(selection, () => $createHeadingNode('h1'));
    }

    if (type === 'h2') {
      return $setBlocksType(selection, () => $createHeadingNode('h2'));
    }

    if (type === 'h3') {
      return $setBlocksType(selection, () => $createHeadingNode('h3'));
    }

    if (type === 'quote') {
      return $setBlocksType(selection, () => $createQuoteNode());
    }
  }

  return (
    <div className="flex flex-row justify-between" ref={toolbarRef}>
      <div className=''>
        <Button
          variant="outline"
          value="undo"
          disabled={!canUndo}
          onClick={() => { editor.dispatchCommand(UNDO_COMMAND, undefined) }}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          value="redo"
          disabled={!canRedo}
          onClick={() => { editor.dispatchCommand(REDO_COMMAND, undefined) }}
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      <div className=' '>
        <Button
          variant="outline"
          value="h1"
          onClick={() => editor.update(() => toggleBlock('h1'))}
        >
          <Heading1 className="h-4 w-4" />
        </Button >
        <Button
          variant="outline"
          onClick={() => editor.update(() => toggleBlock('h2'))}
          value="h2"
        >
          <Heading2 className="h-4 w-4" />
        </Button >
        <Button
          variant="outline"
          onClick={() => editor.update(() => toggleBlock('h3'))}
          value="h3"
        >
          <Heading3 className="h-4 w-4" />
        </Button >
      </div>

      <div className=' '>
        <Button
          variant="outline"
          value="bold"
          onClick={() => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold') }}
        >
          <Bold className="h-4 w-4" />
        </Button >
        <Button
          variant="outline"
          value="italic"
          onClick={() => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic') }}

        >
          <Italic className="h-4 w-4" />
        </Button >
        <Button
          variant="outline"
          value="underline"
          onClick={() => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline'); }}
        >
          <Underline className="h-4 w-4" />
        </Button >
        <Button
          variant="outline"
          value="strikethrough"
          onClick={() => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough') }}
        >
          <Strikethrough className="h-4 w-4" />
        </Button >
      </div>

      <div className=' '>
        <Button
          variant="outline"
          value="left"
          onClick={() => { editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left') }}
        >
          <AlignLeft className="h-4 w-4" />
        </Button >
        <Button
          variant="outline"
          value="center"
          onClick={() => { editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center') }}
        >
          <AlignCenter className="h-4 w-4" />
        </Button >
        <Button
          variant="outline"
          value="right"
          onClick={() => { editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right') }}
        >
          <AlignRight className="h-4 w-4" />
        </Button >
        <Button
          variant="outline"
          value="justify"
          onClick={() => { editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify') }}
        >
          <AlignJustify className="h-4 w-4" />
        </Button >
      </div>
    </div>
  );
}

function useActiveBlock() {
  const [editor] = useLexicalComposerContext();

  const subscribe = useCallback(
    (onStoreChange) => {
      return editor.registerUpdateListener(onStoreChange);
    },
    [editor],
  );

  const getSnapshot = useCallback(() => {
    return editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return null;

      const anchor = selection.anchor.getNode();
      let element =
        anchor.getKey() === 'root'
          ? anchor
          : $findMatchingParent(anchor, (e) => {
            const parent = e.getParent();
            return parent !== null && $isRootOrShadowRoot(parent);
          });

      if (element === null) {
        element = anchor.getTopLevelElementOrThrow();
      }

      if ($isHeadingNode(element)) {
        return element.getTag();
      }

      return element.getType();
    });
  }, [editor]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}