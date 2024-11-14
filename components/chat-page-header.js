'use client'

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { getFileListForChat } from '@/utils/actions';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';


export default function ChatPageHeader({ topicId }) {

  const { data, isLoading } = useQuery({
    queryKey: ['chat', topicId],
    queryFn: () => getFileListForChat(topicId),
  })

  const topicTitle = data?.topicTitle || ''

  // if (isLoading) return <h2 className='text-xl'>Please Wait...</h2>;
  return (
    <Card className="bg-gray-50 border-none">
      <CardHeader className="pt-3" >
        <CardTitle >
          <Button
            asChild
            variant='link'
            className="px-1 mb-1"
          >
            <Link href={'/dashboard/admin'} className='flex items-center gap-x-2'>
              <ChevronLeft /> Vissza
            </Link>
          </Button>
        </CardTitle>
        <CardTitle className="px-1">
          {topicTitle}
        </CardTitle>
      </CardHeader>
    </Card>

  )
}
