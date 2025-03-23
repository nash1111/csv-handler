import * as React from "react";
import Papa from "papaparse";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type CsvRow = { [key: string]: any };

interface Props {
  apiKey: string;
}

export default function CsvUploadTable({ apiKey }: Props) {
  const [data, setData] = React.useState<CsvRow[]>([]);
  const [columns, setColumns] = React.useState<ColumnDef<CsvRow, any>[]>([]);
  const [newColumn, setNewColumn] = React.useState("");

  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;
        if (rows.length > 0) {
          const headers = Object.keys(rows[0]);
          const dynamicCols: ColumnDef<CsvRow, any>[] = headers.map((key) => ({
            accessorKey: key,
            header: key,
          }));
          setColumns(dynamicCols);
        }
        setData(rows);
      },
    });
  };

  const addNewColumn = () => {
    if (!newColumn.trim()) return;

    const updatedData = data.map((row) => ({ ...row, [newColumn]: "" }));
    setData(updatedData);

    setColumns([
      ...columns,
      { accessorKey: newColumn, header: newColumn },
    ]);

    setNewColumn("");
  };

  const handleDownload = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "updated_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {data.length > 0 && (
        <>
          <div className="flex gap-2 items-center mb-4">
            <input
              type="text"
              placeholder="insert new column name"
              value={newColumn}
              onChange={(e) => setNewColumn(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <Button onClick={addNewColumn}>add new column</Button>

            <Button onClick={handleDownload} variant="outline">
              <Download className="mr-2 h-4 w-4" /> CSV Download
            </Button>
          </div>

          <DataTable columns={columns} data={data} />
        </>
      )}
    </div>
  );
}
