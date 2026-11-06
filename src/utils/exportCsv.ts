import type { VatDocument } from "../types/document";

const HEADERS = [
  "Kontrahent",
  "Data",
  "Numer dokumentu",
  "Numer KSeF",
  "Identyfikator",
  "Rodzaj operacji",
  "Kod JPK V7",
  "Seria",
  "Stawka VAT",
  "Netto",
  "VAT",
  "Brutto",
];

function escapeCsv(value: string | number): string {
  const text = String(value);

  return `"${text.replace(/"/g, '""')}"`;
}

export function exportCsv(documents: VatDocument[]): void {
  const rows = documents.map((document) => [
    document.contractor,
    document.date,
    document.documentNumber,
    document.ksefNumber ?? "",
    document.identifier,
    document.type === "invoice" ? "Faktura" : "Korekta",
    document.vatCode ?? "",
    document.series,
    document.vatRate,
    document.netAmount.toFixed(2).replace(".", ","),
    document.vatAmount.toFixed(2).replace(".", ","),
    document.grossAmount.toFixed(2).replace(".", ","),
  ]);

  const csv = [
    HEADERS.map(escapeCsv).join(";"),
    ...rows.map((row) => row.map(escapeCsv).join(";")),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "rejestr-vat.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}
