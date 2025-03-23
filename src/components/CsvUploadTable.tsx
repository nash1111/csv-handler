import * as React from "react";
import Papa from "papaparse";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

type CsvRow = { [key: string]: any };

interface Props {
  apiKey: string;
}

export default function CsvUploadTable({ apiKey }: Props) {
  const [data, setData] = React.useState<CsvRow[]>([]);
  const [columns, setColumns] = React.useState<ColumnDef<CsvRow, any>[]>([]);
  const [firstColumn, setFirstColumn] = React.useState("");
  const [secondColumn, setSecondColumn] = React.useState("");
  const [newColumnName, setNewColumnName] = React.useState("");

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
            id: key,
            accessorFn: (row) => row[key],
            header: key,
          }));
          setColumns(dynamicCols);
        }
        setData(rows);
      },
    });
  };

  const addNewColumn = () => {
    if (!newColumnName.trim()) return;

    const updatedColumns = [
      ...columns,
      {
        id: newColumnName,
        accessorFn: (row) => row[newColumnName],
        header: newColumnName,
      },
    ];

    const updatedData = data.map((row) => ({ ...row, [newColumnName]: "" }));

    setColumns(updatedColumns);
    setData(updatedData);
    setNewColumnName("");
  };

  const analyzeSentiment = async () => {
    if (!firstColumn || !secondColumn) {
      alert("Please select two columns.");
      return;
    }

    const updatedData = [...data];

    for (let i = 0; i < data.length; i++) {
      const text = data[i][firstColumn];
      if (!text || typeof text !== "string" || !text.trim()) {
        updatedData[i][secondColumn] = "";
        continue;
      }

      try {
        const response = await fetch(
          `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ document: { type: "PLAIN_TEXT", content: text } }),
          }
        );

        const result = await response.json();
        updatedData[i][secondColumn] = response.ok ? result.documentSentiment.score : "error";
      } catch {
        updatedData[i][secondColumn] = "error";
      }

      await new Promise((r) => setTimeout(r, 100));
    }

    setData(updatedData);
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
      <input type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="mb-4" />

      {data.length > 0 && (
        <>
          <div className="flex gap-2 items-center mb-4">
            <select value={firstColumn} onChange={(e) => setFirstColumn(e.target.value)} className="border px-2 py-1 rounded">
              <option value="">Select text column</option>
              {columns.map((col) => (
                <option key={col.id} value={col.id}>{col.id}</option>
              ))}
            </select>

            <select value={secondColumn} onChange={(e) => setSecondColumn(e.target.value)} className="border px-2 py-1 rounded">
              <option value="">Select target column</option>
              {columns.map((col) => (
                <option key={col.id} value={col.id}>{col.id}</option>
              ))}
            </select>

            <Button onClick={analyzeSentiment}>Run Sentiment Analysis</Button>

            <input
              type="text"
              placeholder="New column name"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              className="border px-2 py-1 rounded"
            />

            <Button onClick={addNewColumn} variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add Column
            </Button>

            <Button onClick={handleDownload} variant="outline">
              <Download className="mr-2 h-4 w-4" /> Download CSV
            </Button>
          </div>

          <DataTable columns={columns} data={data} />
        </>
      )}
    </div>
  );
}
