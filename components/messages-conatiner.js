'use client'

import { Bot, User } from "lucide-react";
import { Skeleton } from "./ui/skeleton";


export default function MessagesConatiner({ messagesEndRef, messages, isPending }) {

  return (
    <div className='max-h-[calc(100vh-22rem)] overflow-y-auto flex flex-col space-y-2 pr-2'>

      {/* messages map */}
      {messages && messages.map(({ role, content }, index) => {
        const icon = role === 'user' ? <User /> : <Bot />
        return <div key={index} className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
          <div className={`flex gap-2 px-4 py-3 items-start w-4/5 rounded-lg ${role === "user" ? 'border' : "bg-zinc-100"}`}>
            <span>{icon}</span>
            <p>{content}</p>
          </div>
        </div>

      })}

      {/* skeleton */}
      {isPending && <div className="flex justify-start">
        <div className="flex flex-col space-y-3 mt-4">
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-4 w-[275px]" />
        </div>
      </div>}

      {/* scroll */}
      <div ref={messagesEndRef} />
    </div>
  )
}
