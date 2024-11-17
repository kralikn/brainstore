import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import BankStatementUploadForm from './bank_statement-upload-form'

export default function BankStatementUpload({ setTransactions, setStatementData }) {
  return (
    <Card className="bg-gray-50 border-none flex justify-between items-center">
      <CardHeader>
        <CardTitle>
          Bankszámlakivonat feltöltés
        </CardTitle>
        {/* <CardDescription className="px-1">Dokumentum hozzáadása</CardDescription> */}
      </CardHeader>
      <CardContent className="flex mt-8">
        <BankStatementUploadForm setTransactions={setTransactions} setStatementData={setStatementData} />
      </CardContent>
    </Card>
  )
}
