'use client'

import BankStatementUpload from "@/components/bank_statement_upload";
import TransactionsTable from "@/components/transactions-table";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid'


export default function DemoPage() {

  const [transactions, setTransactions] = useState([])
  const [statementData, setStatementData] = useState(null)

  return (
    <div className="flex flex-col gap-4">
      <BankStatementUpload transactions={transactions} setTransactions={setTransactions} setStatementData={setStatementData} />
      <TransactionsTable transactions={transactions} statementData={statementData} />
    </div>
  )
}