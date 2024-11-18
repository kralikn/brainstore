'use client'

import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import BankStatementUploadForm from './bank_statement-upload-form'
import { Button } from './ui/button'
import { CloudDownload } from 'lucide-react'
import * as XLSX from 'xlsx'

export default function BankStatementUpload({ transactions, setTransactions, setStatementData }) {

  const { toast } = useToast()
  const handleSubmit = async (transactions) => {
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils?.json_to_sheet(transactions)
    XLSX.utils.book_append_sheet(workbook, worksheet, "teszt")
    XLSX.writeFile(workbook, `${"teszt"}.xlsx`);

  }

  return (
    <Card className="bg-gray-50 border-none flex justify-between items-center">
      <CardHeader>
        <CardTitle>
          Bankszámlakivonat feltöltés
        </CardTitle>
        {/* <CardDescription className="px-1">Dokumentum hozzáadása</CardDescription> */}
      </CardHeader>
      <CardContent className="flex m-0 p-0">
        <BankStatementUploadForm setTransactions={setTransactions} setStatementData={setStatementData} />
      </CardContent>
      <CardFooter className="px-4 py-0">
        <Button disabled={transactions.length === 0} onClick={() => handleSubmit(transactions)}>
          <CloudDownload /> CSV export
        </Button>
      </CardFooter>
    </Card>
  )
}
