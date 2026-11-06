import type { VatBreakdownItem } from "../../utils/calculateVatBreakdown";
import { formatCurrency } from "../../utils/formatCurrency";
import styles from "./VatBreakdown.module.scss";

interface Props {
  items: VatBreakdownItem[];
}

export function VatBreakdown({ items }: Props) {
  const totalNet = items.reduce((sum, item) => sum + item.net, 0);

  return (
    <section className={styles.section} aria-label="Struktura VAT">
      <div className={styles.heading}>
        <h2>Struktura VAT</h2>
        <span>Udział wartości netto według stawek VAT</span>
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>Brak danych do wyświetlenia.</p>
      ) : (
        <div className={styles.list}>
          {items.map((item) => {
            const percentage = totalNet > 0
              ? (item.net / totalNet) * 100
              : 0;

            return (
              <div className={styles.item} key={item.rate}>
                <div className={styles.itemHeading}>
                  <strong>{item.rate}</strong>
                  <span>{percentage.toFixed(1)}%</span>
                </div>

                <div
                  className={styles.track}
                  role="progressbar"
                  aria-label={`Udział stawki ${item.rate}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Number(percentage.toFixed(1))}
                >
                  <div
                    className={styles.fill}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className={styles.amounts}>
                  <span>Netto: {formatCurrency(item.net)}</span>
                  <span>VAT: {formatCurrency(item.vat)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
