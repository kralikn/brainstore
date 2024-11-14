import SignedUrl from "./signed-url";

export default function ChatFileItem({ doc }) {

  const fileName = doc.doc_original_name.slice(0, -4)

  return (
    <div className="flex justify-between items-start gap-2">
      <div className="">{fileName}</div>
      <SignedUrl signedUrl={doc.signedUrl} />
    </div>
  )
}
