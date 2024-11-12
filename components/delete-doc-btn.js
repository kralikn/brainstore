'use client'

import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { deleteDocument } from "@/utils/actions";


export default function DeleteDocButton({ doc, topicSlug }) {

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: (doc) => deleteDocument(doc),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: 'Valami hiba történt...',
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['topic', topicSlug] })
      toast({ description: data.message })
    },
  });

  const handleSubmit = (doc) => {
    mutate(doc)
  }
  return (
    <Button onClick={() => handleSubmit(doc)} size="sm" variant="destructive" disabled={isPending}>
      <Trash2 /> Törlés
    </Button>

  )
}
