import SignedUrl from "./signed-url"
import DeleteDocButton from "./delete-doc-btn";
import CreateEmbeddingsButton from "./create-embeddings-btn";

export default function DocsLisItem({ doc, topicSlug }) {

  const { doc_original_name, signedUrl, id, embedded } = doc

  return (
    <div className="flex justify-between items-center pl-7 pr-6 py-4 border rounded-md border-t-foreground/10">
      <div className="flex space-x-4">
        <p>{doc_original_name}</p>
      </div>
      <div className="space-x-4">
        <SignedUrl signedUrl={signedUrl} />
        <CreateEmbeddingsButton doc={doc} topicSlug={topicSlug} />
        <DeleteDocButton doc={doc} topicSlug={topicSlug} />
      </div>
    </div>
  )
}
