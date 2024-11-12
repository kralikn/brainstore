'use client'

import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { SendHorizontal } from 'lucide-react'


export default function ChatForm({ onSubmit, form }) {

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
          <FormField
            control={form.control}
            name="chat_message"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl >
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="">
            <SendHorizontal />
          </Button>
        </form>
      </Form>
    </div>
  )
}
