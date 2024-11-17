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
      <Table>
        <TableCaption>A tranzakciók listája.</TableCaption>
        <TableHeader>
          <TableRow>
            {/* <TableHead>Kivonat száma</TableHead> */}
            <TableHead>Értéknap</TableHead>
            <TableHead>Tranzakció típusa</TableHead>
            <TableHead>Megnevezés</TableHead>
            <TableHead>Partner</TableHead>
            <TableHead>Partner bankszámlaszáma</TableHead>
            <TableHead>Összeg</TableHead>
            {/* <TableHead>Jóváírás</TableHead> */}
            {/* <TableHead>Ellenszámlaszám</TableHead>
            <TableHead>Megjegyzés</TableHead>
            <TableHead>Összeg</TableHead> */}
            {/* <TableHead>Devizanem</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            transactions.map(transaction => {
              return (<TableRow key={transaction.id}>
                <TableCell >{transaction.datum}</TableCell>
                <TableCell >{transaction.tipus}</TableCell>
                <TableCell >{transaction.megnevezes}</TableCell>
                <TableCell >{transaction.partner}</TableCell>
                <TableCell >{transaction.partner_bankszamlaszama}</TableCell>
                <TableCell className="text-right">{transaction.tipus === "terhelés" ? Intl.NumberFormat("no").format(-Math.abs(transaction.osszeg)) : Intl.NumberFormat("no").format(transaction.osszeg)}</TableCell>
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
