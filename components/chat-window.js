'use client'

import { useState, useEffect, useRef } from "react";
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
// import ChatForm from "./chat-form";
import MessagesConatiner from "./messages-conatiner";
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { SendHorizontal } from 'lucide-react'
import { useMutation } from "@tanstack/react-query";
import { generateChatResponse } from "@/utils/actions";

const formSchema = z.object({
  chat_message: z.string().min(2, {
    message: "Legalább 2 karakter!"
  }),
})

export default function ChatWindow({ topicId }) {

  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    scrollToBottom(); // Görgetés a végére minden renderelés után
  }, [messages])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chat_message: "",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (values) => generateChatResponse(values),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: 'Valami hiba történt...',
        });
        return;
      }
      form.reset()
      setMessages((prev) => [...prev, data.message])
    }
  })

  const onSubmit = (values) => {
    const query = { role: 'user', content: values.chat_message }
    setMessages((prev) => [...prev, query])
    mutate({ query, topicId })
  }

  return (
    <div className="grid grid-rows-[1fr,auto] h-full border rounded-lg px-6 py-4 gap-4">
      <MessagesConatiner messagesEndRef={messagesEndRef} messages={messages} isPending={isPending} />
      <div className="w-3/4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
            <FormField
              control={form.control}
              name="chat_message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl >
                    <Input placeholder="" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              <SendHorizontal />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
