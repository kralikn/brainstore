'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { getFileFromWeb } from "@/utils/actions";
import { useMutation } from "@tanstack/react-query";
import { CloudUpload, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";


export default function DemoPage() {

  const [rows, setRows] = useState([])

  const { register, handleSubmit, reset } = useForm()
  const { toast } = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: (formData) => getFileFromWeb(formData),
    onSuccess: (data) => {
      if (!data) {
        toast({
          variant: "destructive",
          description: 'Valami hiba történt...',
        });
        return;
      }
      setRows(data)
      toast({ description: data.message })
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
    // mutate()
  }

  return (
    <div className="flex flex-col gap-4">

      {/* form */}
      <Card className="bg-gray-50 border-none">
        <CardHeader>
          <CardTitle>
            Fájl lekérdezése
          </CardTitle>
        </CardHeader>
        <CardContent >
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 m-0 p-0">
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
          {/* <Button onClick={onSubmit}>
            <Download /> Lekérdezés
          </Button> */}
        </CardContent>
      </Card>

      {/* table */}
      <Table>
        <TableCaption>Első oldal sorai</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Sor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            rows.map((row, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{row}</TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>

    </div>
  )
}