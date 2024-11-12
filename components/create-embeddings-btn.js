'use client'

import { FileStack } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmbeddings } from "@/utils/actions";


export default function CreateEmbeddingsButton({ doc, topicSlug }) {

  const { doc_original_name, signedUrl, id, embedded } = doc

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: (doc) => createEmbeddings(doc),
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
    <Button onClick={() => handleSubmit(doc)} size='sm' variant="" disabled={embedded || isPending}>
      <FileStack /> Feldolgozás
    </Button>

  )
}
