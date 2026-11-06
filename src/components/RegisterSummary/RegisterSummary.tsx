import type { RegisterSummary as Summary } from "../../utils/calculateSummary";
import { formatCurrency } from "../../utils/formatCurrency";
import styles from "./RegisterSummary.module.scss";

interface Props {
  summary: Summary;
}

export function RegisterSummary({ summary }: Props) {
  const items = [
    { label: "Netto", value: summary.net },
    { label: "VAT", value: summary.vat },
    { label: "Brutto", value: summary.gross },
  ];

  return (
    <section
      className={styles.summary}
      aria-label="Podsumowanie rejestru"
    >
      {items.map(({ label, value }) => (
        <div
          className={styles.item}
          key={label}
        >
          <span className={styles.label}>{label}</span>
          <strong className={styles.value}>
            {formatCurrency(value)}
          </strong>
        </div>
      ))}
    </section>
  );
}
