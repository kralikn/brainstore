'use client'

import BankStatementUpload from "@/components/bank_statement_upload";
import TransactionsTable from "@/components/transactions-table";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid'


export default function DemoPage() {

  const [transactions, setTransactions] = useState([])
  const [statementData, setStatementData] = useState(null)
  // const initialData = [
  //   {
  //     id: uuidv4(),
  //     datum: "2024-09-05",
  //     tipus: "terhelés",
  //     megnevezes: "GIRO átutalás jóváírása",
  //     partner: "FAKÉP BT",
  //     partner_bankszamlaszama: "HU07117050082042865900000000",
  //     megjegyzes: "E-Trium-2024-247",
  //     osszeg: 130510
  //   },
  //   {
  //     id: uuidv4(),
  //     datum: "2024-09-05",
  //     tipus: "jóváírás",
  //     megnevezes: "Toke elszámolása",
  //     partner: "GEO-LOG KÖRNYEZETVÉD. ÉS GEOFIZ.KFT",
  //     partner_bankszamlaszama: "HU73117140062024733900000000",
  //     megjegyzes: "E-TRIUM-2024-203 szla",
  //     osszeg: 327919
  //   }
  // ]

  // useEffect(() => {
  //   setTransactions(initialData)
  // }, [])


  return (
    <div className="flex flex-col gap-4">
      <BankStatementUpload setTransactions={setTransactions} setStatementData={setStatementData} />
      <TransactionsTable transactions={transactions} statementData={statementData} />
    </div>
  )
}