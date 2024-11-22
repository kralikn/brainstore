"use client"

import links from '@/utils/links';
import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { Brain, BrainCircuit, Radar } from 'lucide-react';
import { CardTitle } from './ui/card';

export default function Sidebar() {

  const pathname = usePathname()

  return (
    <div className="h-full bg-gray-50">
      <CardTitle className="h-20 flex flex-row justify-center items-center gap-1 text-4xl">
        <span>brainst</span>
        <span className="-ml-0.5 -mr-1 mb-1 animate-pulse"><Brain size={31} /></span>
        <span>re</span>
      </CardTitle>

      <div className="row-span-11 flex flex-col gap-y-4 pt-4 px-8">
        {links.map((link) => {
          return (
            <Button
              asChild
              key={link.label}
              size="sm"
              // variant={pathname.startsWith(link.href) ? 'default' : 'link'}
              variant={pathname === link.href ? 'default' : 'link'}
            >
              <Link href={link.href} className='flex items-center gap-x-2'>
                {link.icon} <span className='capitalize text-left'>{link.label}</span>
              </Link>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
