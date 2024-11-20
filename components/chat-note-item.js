import { SquarePen } from "lucide-react";

export default function ChatNoteItem({ note }) {


  return (
    <div className="flex justify-between items-start gap-2">
      <div className="flex gap-3 items-center">
        <SquarePen size={18} />
        <div className="">{note.title}</div>
      </div>
    </div>
  )
}
