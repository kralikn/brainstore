import SignedUrl from "./signed-url";

export default function ChatFileItem({ doc }) {

  return (
    <div className="flex justify-between items-start">
      <div className="pr-1">{doc.doc_original_name}</div>
      <SignedUrl signedUrl={doc.signedUrl} />
    </div>
  )
}
