'use client'

import { Button } from './ui/button'
import { useForm } from 'react-hook-form'
import { useToast } from "@/hooks/use-toast"
import { Input } from './ui/input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extractBankTransactions } from '@/utils/actions'
import { CloudUpload, Loader2 } from 'lucide-react'


export default function BankStatementUploadForm({ setTransactions, setStatementData }) {

  const { toast } = useToast()

  const { register, handleSubmit, reset } = useForm()

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (formData) => extractBankTransactions(formData),
    onSuccess: (data) => {
      if (!data) {
        toast({
          variant: "destructive",
          description: 'Valami hiba történt...',
        });
        return;
      }
      console.log(data);
      // setTransactions(data)
      setTransactions(data.transactions)
      setStatementData(data.statement_data)
      toast({ description: "A tranzakciókat sikerült kinyerni." })
      reset()
    },
  });

  const onSubmit = (data) => {

    if (!data.bank_statement[0]) {
      toast({
        description: 'Kérlek válassz egy fájlt!',
      });
      return;
    }

    const formData = new FormData();
    formData.append('bank_statement', data.bank_statement[0])
    mutate({ formData });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
      <Input
        type="file"
        id="bank_statement"
        name="bank_statement"
        placeholder="Fájl kiválasztása..."
        required
        accept="application/pdf"
        {...register("bank_statement")}
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="animate-spin" /> : <CloudUpload />} Feltöltés
      </Button>
    </form>
  )
}
