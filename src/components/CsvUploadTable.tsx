import * as React from "react"
import Papa from "papaparse"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./DataTable"

type CsvRow = { [key: string]: any }

export default function CsvUploadTable() {
  const [data, setData] = React.useState<CsvRow[]>([])
  const [columns, setColumns] = React.useState<ColumnDef<CsvRow, any>[]>([])

  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data
        if (rows.length > 0) {
          const headers = Object.keys(rows[0])
          const dynamicCols: ColumnDef<CsvRow, any>[] = headers.map(key => ({
            accessorKey: key,
            header: key,
          }))
          setColumns(dynamicCols)
        }
        setData(rows)
      }
    })
  }

  return (
    <div>
      <input
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileUpload}
        className="mb-4"
      />
      {data.length > 0 && (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  )
}