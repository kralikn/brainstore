
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { useQuery } from '@tanstack/react-query'
import { getFiles } from '@/utils/actions'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import FileUploadForm from './file-upload-form'
import LoadingDocsListHeader from './loading-docs-list-header'

export default function FileUpload({ topicSlug }) {

  const { data, isLoading, isPending } = useQuery({
    queryKey: ['topic', topicSlug],
    queryFn: () => getFiles(topicSlug),
  })

  const topicTitle = data?.topicTitle || ""

  if (isPending) return <LoadingDocsListHeader />

  return (
    <Card className="bg-gray-50 border-none flex justify-between items-end">
      <CardHeader className="pt-3">
        <CardTitle >
          <Button
            asChild
            variant='link'
            className="p-1 mb-1"
          >
            <Link href={'/dashboard/admin'} className='flex items-center gap-x-2'>
              <ChevronLeft size={32} /> Vissza
            </Link>
          </Button>
        </CardTitle>
        <CardTitle className="px-1">
          {topicTitle}
        </CardTitle>
        <CardDescription className="px-1">Dokumentum hozzáadása</CardDescription>
      </CardHeader>
      <CardContent className="flex mt-8">
        <FileUploadForm topicSlug={topicSlug} />
      </CardContent>
    </Card>
  )
}
