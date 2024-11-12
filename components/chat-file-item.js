import SignedUrl from "./signed-url";

export default function ChatFileItem({ doc }) {

  return (
    <div className="flex justify-between items-center">
      <div>{doc.doc_original_name}</div>
      <SignedUrl signedUrl={doc.signedUrl} />
    </div>
  )
}
