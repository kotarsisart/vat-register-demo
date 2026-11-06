
import { AlertTriangle, Building2 } from "lucide-react";
import styles from "./RegisterContext.module.scss";

export function RegisterContext() {
  return (
    <section className={styles.context} aria-label="Kontekst organizacji">
      <div className={styles.company}>
        <div className={styles.companyInfo}>
          <Building2 size={20} aria-hidden="true" />

          <strong>Onsaldo Preview Sp. z o.o.</strong>
        </div>

        <div className={styles.badges}>
          <span className={styles.statusBadge}>
            Wymaga potwierdzenia
          </span>

          <span className={styles.demoBadge}>
            DEMO
          </span>
        </div>
      </div>

      <div className={styles.warning} role="note">
        <AlertTriangle size={18} aria-hidden="true" />

        <p>
          Kontekst VAT wymaga potwierdzenia. Poniżej wyłącznie dane
          demonstracyjne, nie ewidencja organizacji.
        </p>
      </div>
    </section>
  );
}
