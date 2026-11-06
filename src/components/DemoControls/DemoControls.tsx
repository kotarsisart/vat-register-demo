
import type { DataStatus } from "../../types/document";
import styles from "./DemoControls.module.scss";

interface Props {
  status: DataStatus;
  onStatusChange: (status: DataStatus) => void;
}

const STATUSES: { value: DataStatus; label: string }[] = [
  { value: "filled", label: "Dane" },
  { value: "empty", label: "Pusto" },
  { value: "error", label: "Błąd" },
];

export function DemoControls({ status, onStatusChange }: Props) {
  return (
    <div className={styles.controls}>
      <span className={styles.label}>Tryb demonstracyjny</span>

      <div
        className={styles.options}
        role="group"
        aria-label="Stan danych"
      >
        {STATUSES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={status === value ? styles.active : styles.button}
            aria-pressed={status === value}
            onClick={() => onStatusChange(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
