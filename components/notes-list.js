'use client'

import { useQuery } from "@tanstack/react-query"
import LoadingNotesListHeader from "./loading-notes-list-header"
import { getNotes } from "@/utils/actions"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import NotesListItem from "./notes-list-item"
import LoadingNotes from "./loading-notes"
import { Separator } from "./ui/separator"

export default function NotesList({ topicSlug }) {

  const { data, isLoading, isPending } = useQuery({
    queryKey: ['notes', topicSlug],
    queryFn: () => getNotes(topicSlug),
  })

  const notes = data?.notes || []

  console.log(data);

  if (isLoading || isPending) return <LoadingNotes />

  return (
    <Card className='w-full h-full'>
      <CardHeader>
        <CardTitle className="text-xl">Jegyzetek</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {notes.map(note => {
          return (
            <>
              <Separator className="" />
              <NotesListItem
                key={note.id}
                note={note}
                topicSlug={topicSlug}
              />
              {/* <Separator className="" /> */}
            </>
          )
        })}
      </CardContent>
    </Card>
  )
}
