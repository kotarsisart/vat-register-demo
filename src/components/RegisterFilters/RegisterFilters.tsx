import { useState } from "react";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

import styles from "./RegisterFilters.module.scss";

export interface FilterValues {
  year: string;
  month: string;
  type: string;
  vatCode: string;
  series: string;
}

interface Props {
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
  onReset: () => void;
}

const months = [
  "Styczeń", "Luty", "Marzec", "Kwiecień",
  "Maj", "Czerwiec", "Lipiec", "Sierpień",
  "Wrzesień", "Październik", "Listopad", "Grudzień",
];

export function RegisterFilters({ filters, onChange, onReset }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = Object.values(filters).filter(Boolean).length;

  function updateFilter(key: keyof FilterValues, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <section className={styles.filters} aria-label="Filtry dokumentów">
      <button
        type="button"
        className={styles.mobileToggle}
        aria-expanded={isOpen}
        aria-controls="register-filter-fields"
        onClick={() => setIsOpen((current) => !current)}
      >
        <SlidersHorizontal size={18} aria-hidden="true" />
        <span>Filtry {activeCount > 0 && `(${activeCount})`}</span>
        {
          isOpen
          ? <ChevronUp size={18} aria-hidden="true" />
          : <ChevronDown size={18} aria-hidden="true" />
        }
      </button>

      <div
        id="register-filter-fields"
        className={`${styles.content} ${isOpen ? styles.open : ""}`}
      >

      <div className={styles.grid}>
        <label>
          Rok
          <select
            value={filters.year}
            onChange={(event) => updateFilter("year", event.target.value)}
          >
            <option value="">Wszystkie lata</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </label>

        <label>
          Miesiąc
          <select
            value={filters.month}
            onChange={(event) => updateFilter("month", event.target.value)}
          >
            <option value="">Wszystkie miesiące</option>
            {months.map((month, index) => (
              <option key={month} value={String(index + 1).padStart(2, "0")}>
                {month}
              </option>
            ))}
          </select>
        </label>

        <label>
          Rodzaj operacji
          <select
            value={filters.type}
            onChange={(event) => updateFilter("type", event.target.value)}
          >
            <option value="">Wszystkie</option>
            <option value="invoice">Faktura</option>
            <option value="correction">Korekta</option>
          </select>
        </label>

        <label>
          Kod JPK V7
          <select
            value={filters.vatCode}
            onChange={(event) => updateFilter("vatCode", event.target.value)}
          >
            <option value="">Wszystkie</option>
            <option value="GTU_01">GTU_01</option>
            <option value="GTU_02">GTU_02</option>
            <option value="none">Bez kodu</option>
          </select>
        </label>

        <label>
          Seria dokumentu
          <select
            value={filters.series}
            onChange={(event) => updateFilter("series", event.target.value)}
          >
            <option value="">Wszystkie</option>
            <option value="FV">FV</option>
            <option value="FK">FK</option>
            <option value="FZ">FZ</option>
            <option value="FKZ">FKZ</option>
          </select>
        </label>
      </div>

        <button
          type="button"
          className={styles.reset}
          onClick={onReset}
        >
          Wyczyść wszystko
        </button>
      </div>
    </section>
  );
}
