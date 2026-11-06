
export type RegisterType = "sales" | "purchases";

export type DocumentType = "invoice" | "correction";

export const VAT_RATES = ["23%", "8%", "5%", "0%", "np"] as const;

export type VatRate = (typeof VAT_RATES)[number];

export interface VatDocument {
  id: string;
  contractor: string;
  date: string;
  documentNumber: string;
  ksefNumber: string | null;
  identifier: string;
  type: DocumentType;
  vatCode: string | null;
  series: string;
  register: RegisterType;
  netAmount: number;
  vatAmount: number;
  grossAmount: number;
  vatRate: VatRate;
}

export type DataStatus = "filled" | "empty" | "error";
