import { File } from "lucide-react";
import SignedUrl from "./signed-url";

export default function ChatFileItem({ doc }) {

  const fileName = doc.doc_original_name.slice(0, -4)

  return (
    <div className="flex justify-between items-start gap-2">
      <div className="flex gap-3 items-center">
        <File />
        <div className="">{fileName}</div>
      </div>
      <SignedUrl signedUrl={doc.signedUrl} />
    </div>
  )
}
