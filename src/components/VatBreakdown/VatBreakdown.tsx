
import type { VatBreakdownItem } from "../../utils/calculateVatBreakdown";
import { formatCurrency } from "../../utils/formatCurrency";

import styles from "./VatBreakdown.module.scss";

interface Props {
  items: VatBreakdownItem[];
}

const colors = [
  "#6554b5",
  "#a995e7",
  "#d2c8f4",
  "#b7b2c7",
  "#e4e0ed",
];

export function VatBreakdown({ items }: Props) {
  const totalNet = items.reduce(
    (sum, item) => sum + item.net,
    0,
  );

  const segments = items.reduce<string[]>((acc, item, index) => {
    const portion =
      totalNet > 0 ? (item.net / totalNet) * 100 : 0;

    const from = acc.reduce((sum, segment) => {
      const end = Number(segment.match(/([\d.]+)%$/)?.[1] ?? 0);
      return Math.max(sum, end);
    }, 0);

    const to = from + portion;

    return [
      ...acc,
      `${colors[index % colors.length]} ${from}% ${to}%`,
    ];
  }, []);

  const chartBackground = segments.length
    ? `conic-gradient(${segments.join(", ")})`
    : "var(--color-surface-subtle)";

  return (
    <section
      className={styles.section}
      aria-label="Struktura VAT"
    >
      <div className={styles.heading}>
        <span className={styles.eyebrow}>
          ANALIZA PODATKOWA
        </span>

        <h2>Struktura VAT</h2>

        <p>Udział wartości netto według stawek VAT</p>
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>
          Brak danych do wyświetlenia.
        </p>
      ) : (
        <>
          <div
            className={styles.chart}
            role="img"
            aria-label={items
              .map(
                (item) =>
                  `${item.rate}: ${
                    totalNet
                      ? ((item.net / totalNet) * 100).toFixed(1)
                      : 0
                  }%`,
              )
              .join(", ")}
            style={{ background: chartBackground }}
          >
            <div className={styles.chartCenter}>
              <span>Łącznie netto</span>

              <strong>
                {formatCurrency(totalNet)}
              </strong>
            </div>
          </div>

          <div className={styles.legend}>
            {items.map((item, index) => (
              <div
                key={item.rate}
                className={styles.legendRow}
              >
                <span
                  className={styles.dot}
                  style={{
                    background: colors[index % colors.length],
                  }}
                />

                <strong>{item.rate}</strong>

                <span>
                  {totalNet
                    ? ((item.net / totalNet) * 100).toFixed(1)
                    : 0}
                  %
                </span>

                <small>
                  Netto: {formatCurrency(item.net)} · VAT:{" "}
                  {formatCurrency(item.vat)}
                </small>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
