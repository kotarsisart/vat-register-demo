import type { VatDocument } from "../types/document";

function calculateVat(netAmount: number, rate: number): number {
  return Number((netAmount * rate).toFixed(2));
}


export const documents: VatDocument[] = Array.from(
  { length: 14 },
  (_, index) => {
    const number = index + 1;

    const month = index < 10 ? 10 : 9;
    const year = index < 12 ? 2026 : 2025;
    const day = String(number).padStart(2, "0");

    const vatRate = index % 5 === 0 ? "8%" : index % 7 === 0 ? "0%" : "23%";
    const rate = vatRate === "23%" ? 0.23 : vatRate === "8%" ? 0.08 : 0;

    const netAmount = index === 0 ? 970 : 680;
    const vatAmount = calculateVat(netAmount, rate);

    const type = index % 6 === 0 ? "correction" : "invoice";
    const series = type === "correction" ? "FK" : "FV";

    return {
      id: `sales-${number}`,
      contractor: `Demo Alfa ${day}`,
      date: `${year}-${String(month).padStart(2, "0")}-${day}`,
      documentNumber: `${series}/${number}/${month}/${year}/DEMO`,
      ksefNumber:
      index % 4 === 0
        ? `DEMO-KSEF-S-${number}`
        : null,
      identifier: `DEMO-S-${number}`,
      type,
      vatCode: index % 4 === 0 ? "GTU_01" : null,
      series,
      register: "sales",
      netAmount,
      vatAmount,
      grossAmount: Number((netAmount + vatAmount).toFixed(2)),
      vatRate,
    };
  },
);



export const purchaseDocuments: VatDocument[] = Array.from(
  { length: 8 },
  (_, index) => {
    const number = index + 1;

    const month = index < 5 ? 10 : 9;
    const year = index === 7 ? 2025 : 2026;
    const day = String(number + 3).padStart(2, "0");

    const vatRate = index % 3 === 0 ? "8%" : "23%";
    const rate = vatRate === "8%" ? 0.08 : 0.23;

    const netAmount = 400 + index * 150;
    const vatAmount = calculateVat(netAmount, rate);

    const type = index === 4 ? "correction" : "invoice";
    const series = type === "correction" ? "FKZ" : "FZ";

    return {
      id: `purchase-${number}`,
      contractor: `Demo Beta ${String(number).padStart(2, "0")}`,
      date: `${year}-${String(month).padStart(2, "0")}-${day}`,
      documentNumber: `${series}/${number}/${month}/${year}/DEMO`,
      ksefNumber:
      index % 4 === 0
        ? `DEMO-KSEF-P-${number}`
        : null,
      identifier: `DEMO-P-${number}`,
      type,
      vatCode: index % 4 === 0 ? "GTU_02" : null,
      series,
      register: "purchases",
      netAmount,
      vatAmount,
      grossAmount: Number((netAmount + vatAmount).toFixed(2)),
      vatRate,
    };
  },
);


export const allDocuments: VatDocument[] = [
  ...documents,
  ...purchaseDocuments,
];
