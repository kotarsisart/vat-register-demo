import type { VatDocument } from "../types/document";

export interface RegisterSummary {
  net: number;
  vat: number;
  gross: number;
}

export function calculateSummary(
  documents: VatDocument[],
): RegisterSummary {
  return documents.reduce(
    (summary, document) => ({
      net: summary.net + document.netAmount,
      vat: summary.vat + document.vatAmount,
      gross: summary.gross + document.grossAmount,
    }),
    { net: 0, vat: 0, gross: 0 },
  );
}
