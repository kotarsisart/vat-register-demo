import type {
  DataStatus,
  RegisterType,
  VatDocument,
} from "../../types/document";

import { calculateSummary } from "../../utils/calculateSummary";
import { formatCurrency } from "../../utils/formatCurrency";

import styles from "./PrintableRegister.module.scss";

interface Props {
  register: RegisterType;
  documents: VatDocument[];
  dataStatus: DataStatus;
}

export function PrintableRegister({
  register,
  documents,
  dataStatus,
}: Props) {
  const summary = calculateSummary(documents);

  const registerName =
    register === "sales"
      ? "Rejestr VAT sprzedaży"
      : "Rejestr VAT zakupów";

  return (
    <section className={styles.printable}>
      <header className={styles.header}>
        <h1>{registerName}</h1>
        <p>Onsaldo Preview Sp. z o.o.</p>
        <span>DEMO — dane demonstracyjne</span>
      </header>

      <p className={styles.notice}>
        Kontekst VAT wymaga potwierdzenia. Poniżej wyłącznie
        dane demonstracyjne, nie ewidencja organizacji.
      </p>

      {dataStatus === "error" ? (
        <p className={styles.message}>
          Nie udało się pobrać danych rejestru VAT.
        </p>
      ) : (
        <>
          <div className={styles.summary}>
            <div>
              <span>Netto</span>
              <strong>{formatCurrency(summary.net)}</strong>
            </div>

            <div>
              <span>VAT</span>
              <strong>{formatCurrency(summary.vat)}</strong>
            </div>

            <div>
              <span>Brutto</span>
              <strong>{formatCurrency(summary.gross)}</strong>
            </div>
          </div>

          {documents.length === 0 ? (
            <p className={styles.message}>
              Brak dokumentów do wyświetlenia.
            </p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Kontrahent</th>
                  <th>Numer dokumentu</th>
                  <th>Netto</th>
                  <th>VAT</th>
                  <th>Brutto</th>
                </tr>
              </thead>

              <tbody>
                {documents.map((document) => (
                  <tr key={document.id}>
                    <td>{document.date}</td>
                    <td>{document.contractor}</td>
                    <td>{document.documentNumber}</td>
                    <td>{formatCurrency(document.netAmount)}</td>
                    <td>{formatCurrency(document.vatAmount)}</td>
                    <td>{formatCurrency(document.grossAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </section>
  );
}
