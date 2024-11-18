import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function TransactionsTable({ transactions, statementData }) {

  if (transactions.length === 0) return (
    <div className="w-full mx-auto p-4">
      <p className="text-center">Nincsenek tranzakciók importálva</p>
    </div>
  )
  return (
    <div>
      <Table className="text-xs">
        <TableCaption>A tranzakciók listája.</TableCaption>
        <TableHeader>
          <TableRow className="p-1 m-0">
            <TableHead className="py-1 px-2 m-0">Kivonatszám</TableHead>
            <TableHead className="py-1 px-2 m-0">Értéknap</TableHead>
            <TableHead className="py-1 px-2 m-0">Megnevezés</TableHead>
            <TableHead className="py-1 px-2 m-0">Partner</TableHead>
            <TableHead className="py-1 px-2 m-0">Partner bankszámlaszáma</TableHead>
            <TableHead className="py-1 px-2 m-0">Megjegyzés</TableHead>
            <TableHead className="py-1 px-2 m-0 text-right">Összeg</TableHead>
            <TableHead className="py-1 px-2 m-0">Devizanem</TableHead>
            {/* <TableHead>Jóváírás</TableHead> */}
            {/* <TableHead>Ellenszámlaszám</TableHead>
            <TableHead>Megjegyzés</TableHead>
            <TableHead>Összeg</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            transactions.map(transaction => {
              return (<TableRow key={transaction.id} className="p-1 m-0">
                <TableCell className="py-1 px-2 m-0">{statementData.statement_number}</TableCell>
                <TableCell className="py-1 px-2 m-0">{transaction.datum}</TableCell>
                <TableCell className="py-1 px-2 m-0">{transaction.megnevezes}</TableCell>
                <TableCell className="py-1 px-2 m-0">{transaction.partner}</TableCell>
                <TableCell className="py-1 px-2 m-0">{transaction.partner_bankszamlaszama}</TableCell>
                <TableCell className="py-1 px-2 m-0">{transaction.megjegyzes}</TableCell>
                <TableCell className="py-1 px-2 m-0 text-right">{transaction.tipus === "terhelés" ? Intl.NumberFormat("no").format(-Math.abs(transaction.osszeg)) : Intl.NumberFormat("no").format(transaction.osszeg)}</TableCell>
                <TableCell className="py-1 px-2 m-0">{statementData.currency}</TableCell>
                {/* <TableCell className="text-right">{Intl.NumberFormat("no").format(transaction.jóváírás)}</TableCell>
                <TableCell >{statementData.statement_number}</TableCell>
                <TableCell >{transaction.datum}</TableCell>
                <TableCell >{transaction.tipus}</TableCell>
                <TableCell >{transaction.megnevezes}</TableCell>
                <TableCell >{transaction.partner}</TableCell>
                <TableCell >{transaction.partner_bankszamlaszama}</TableCell>
                <TableCell >{transaction.megjegyzes}</TableCell>
                <TableCell >{typeof transaction.osszeg}</TableCell>
                <TableCell className="text-right" >{Intl.NumberFormat("no").format(transaction.osszeg)}</TableCell>
                <TableCell className="text-right" >{transaction.osszeg}</TableCell>
                <TableCell >{statementData.currency}</TableCell> */}
              </TableRow>)
            })
          }

        </TableBody>
      </Table>

    </div >
  )
}
