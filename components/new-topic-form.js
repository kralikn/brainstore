'use client'

import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { createTopic } from "@/utils/actions"
import { FolderPlus, Loader2, SquarePlus } from "lucide-react"

const formSchema = z.object({
  topic_title: z.string().min(3, {
    message: "Legalább 3 karakter!"
  }),
})

export default function NewTopicForm() {

  const queryClient = useQueryClient()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic_title: "",
    },
  })

  const { toast } = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: (values) => createTopic(values),
    onSuccess: (data) => {
      if (!data) {
        toast({
          variant: "destructive",
          description: 'Valami hiba történt...',
        });
        return;
      }
      toast({ description: data.message })
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['topics'] })
    },
  });

  const onSubmit = (values) => {
    mutate(values)
  }
  return (
    <Card className="bg-gray-50 border-none">
      <CardHeader>
        <CardTitle>
          Témakör hozzáadása
        </CardTitle>

      </CardHeader>
      <CardContent >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
            <FormField
              control={form.control}
              name="topic_title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Új témakör címe..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : <FolderPlus />}Létrehozás
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
