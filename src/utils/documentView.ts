
import type { VatDocument } from "../types/document";
import { formatCurrency } from "./formatCurrency";

export function getDocumentView(document: VatDocument) {
  return {
    net: formatCurrency(document.netAmount),
    vat: formatCurrency(document.vatAmount),
    gross: formatCurrency(document.grossAmount),
    operationType:
      document.type === "invoice" ? "Faktura" : "Korekta",
    ksefNumber: document.ksefNumber ?? "Brak",
    vatCode: document.vatCode ?? "Brak",
  };
}
