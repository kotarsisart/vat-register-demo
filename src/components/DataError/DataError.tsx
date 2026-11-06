import { AlertCircle, RotateCcw } from "lucide-react";
import styles from "./DataError.module.scss";

interface Props {
  onRetry: () => void;
}

export function DataError({ onRetry }: Props) {
  return (
    <section className={styles.error} role="alert">
      <AlertCircle size={28} aria-hidden="true" />

      <h2>Nie udało się pobrać danych</h2>

      <p>
        Wystąpił problem podczas ładowania rejestru VAT.
        Spróbuj ponownie.
      </p>

      <button type="button" onClick={onRetry}>
        <RotateCcw size={17} aria-hidden="true" />
        Spróbuj ponownie
      </button>
    </section>
  );
}
