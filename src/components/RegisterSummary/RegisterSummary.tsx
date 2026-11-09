import type { RegisterSummary as Summary } from "../../utils/calculateSummary";
import { formatCurrency } from "../../utils/formatCurrency";

import styles from "./RegisterSummary.module.scss";

interface Props {
  summary: Summary;
}

export function RegisterSummary({ summary }: Props) {
  return (
    <section
      className={styles.summary}
      aria-label="Podsumowanie rejestru"
    >
      <span className={styles.eyebrow}>
        PODSUMOWANIE FINANSOWE
      </span>

      <h2>Wartość brutto</h2>

      <strong className={styles.hero}>
        {formatCurrency(summary.gross)}
      </strong>

      <div className={styles.metrics}>
        <div>
          <span>Wartość netto</span>

          <strong>
            {formatCurrency(summary.net)}
          </strong>
        </div>

        <div>
          <span>Podatek VAT</span>

          <strong>
            {formatCurrency(summary.vat)}
          </strong>
        </div>
      </div>

      <p className={styles.note}>
        Wartości obliczone na podstawie aktualnie wyświetlanych
        dokumentów.
      </p>
    </section>
  );
}
