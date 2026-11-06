import type { VatDocument, VatRate } from "../types/document";
import { VAT_RATES } from "../types/document";

export interface VatBreakdownItem {
  rate: VatRate;
  net: number;
  vat: number;
  gross: number;
}


export function calculateVatBreakdown(
  documents: VatDocument[],
): VatBreakdownItem[] {
  return VAT_RATES.map((rate) => {
    const matchingDocuments = documents.filter(
      (document) => document.vatRate === rate,
    );

    return {
      rate,
      net: matchingDocuments.reduce(
        (sum, document) => sum + document.netAmount,
        0,
      ),
      vat: matchingDocuments.reduce(
        (sum, document) => sum + document.vatAmount,
        0,
      ),
      gross: matchingDocuments.reduce(
        (sum, document) => sum + document.grossAmount,
        0,
      ),
    };
  }).filter((item) => item.net !== 0 || item.vat !== 0);
}
