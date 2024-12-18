'use client'

import { useQuery } from "@tanstack/react-query"
import DocsLisItem from "./docs-list-item";
import { getFiles } from "@/utils/actions"
import LoadingDocsList from "./loading-docs-list";


export default function DocsList({ topicSlug }) {

  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ['topic', topicSlug],
    queryFn: () => getFiles(topicSlug),
  })

  const docs = data?.docs || []

  if (isLoading || isRefetching) return <LoadingDocsList />

  return (
    <div className="flex flex-col gap-3">
      {docs.map(doc => {
        return <DocsLisItem key={doc.id} doc={doc} topicSlug={topicSlug} />
      })}
    </div>
  )
}
