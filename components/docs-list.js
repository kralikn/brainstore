'use client'

import { useQuery } from "@tanstack/react-query"
import DocsLisItem from "./docs-list-item";
import { CloudDownload } from "lucide-react";
import { getFiles } from "@/utils/actions"
import { useQueryClient } from "@tanstack/react-query";
import LoadingDocsList from "./loading-docs-list";


export default function DocsList({ topicSlug }) {

  const { data, isRefetching } = useQuery({
    queryKey: ['topic', topicSlug],
    queryFn: () => getFiles(topicSlug),
  })

  const docs = data?.docs || []

  if (isRefetching) return <LoadingDocsList />

  return (
    <div className="flex flex-col gap-3">
      {docs.map(doc => {
        return <DocsLisItem key={doc.id} doc={doc} topicSlug={topicSlug} />
      })}
    </div>
  )
}
