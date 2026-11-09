import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SlidersHorizontal, X } from "lucide-react";

import styles from "./RegisterFilters.module.scss";

export interface FilterValues {
  year: string;
  month: string;
  type: string;
  vatCode: string;
  series: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
  onReset: () => void;
}

const months = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];

export function RegisterFilters({
  open,
  onClose,
  filters,
  onChange,
  onReset,
}: Props) {
  const [draft, setDraft] = useState(filters);

  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock background scrolling and manage focus while the drawer is open.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    document.body.style.overflow = "hidden";

    const focusFrame = requestAnimationFrame(() => {
      closeRef.current?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), select:not([disabled]), input:not([disabled])",
        ),
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);

      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);

      previousFocus?.focus();
    };
  }, [open, onClose]);

  // Update individual draft fields without applying them immediately.
  const update = (key: keyof FilterValues, value: string) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleReset = () => {
    const empty: FilterValues = {
      year: "",
      month: "",
      type: "",
      vatCode: "",
      series: "",
    };

    setDraft(empty);
    onReset();
    onClose();
  };

  const handleApply = () => {
    onChange(draft);
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Zamknij filtry"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-heading"
      >
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>
              PERSONALIZACJA WIDOKU
            </span>

            <h2 id="filters-heading">
              Filtry dokumentów
            </h2>
          </div>

          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Zamknij"
          >
            <X size={21} />
          </button>
        </header>

        <p className={styles.description}>
          Wybierz kryteria. Wyniki zaktualizują się po zastosowaniu
          filtrów.
        </p>

        <div className={styles.fields}>
          <fieldset className={styles.group}>
            <legend>Okres</legend>

            <div className={styles.pair}>
              <label>
                Rok

                <select
                  value={draft.year}
                  onChange={(event) =>
                    update("year", event.target.value)
                  }
                >
                  <option value="">Wszystkie lata</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </label>

              <label>
                Miesiąc

                <select
                  value={draft.month}
                  onChange={(event) =>
                    update("month", event.target.value)
                  }
                >
                  <option value="">Wszystkie miesiące</option>

                  {months.map((month, index) => (
                    <option
                      key={month}
                      value={String(index + 1).padStart(2, "0")}
                    >
                      {month}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset className={styles.group}>
            <legend>Dokument</legend>

            <label>
              Rodzaj operacji

              <select
                value={draft.type}
                onChange={(event) =>
                  update("type", event.target.value)
                }
              >
                <option value="">Wszystkie</option>
                <option value="invoice">Faktura</option>
                <option value="correction">Korekta</option>
              </select>
            </label>

            <label>
              Seria dokumentu

              <select
                value={draft.series}
                onChange={(event) =>
                  update("series", event.target.value)
                }
              >
                <option value="">Wszystkie</option>

                {["FV", "FK", "FZ", "FKZ"].map((series) => (
                  <option key={series} value={series}>
                    {series}
                  </option>
                ))}
              </select>
            </label>
          </fieldset>

          <fieldset className={styles.group}>
            <legend>Podatki</legend>

            <label>
              Kod JPK V7

              <select
                value={draft.vatCode}
                onChange={(event) =>
                  update("vatCode", event.target.value)
                }
              >
                <option value="">Wszystkie</option>
                <option value="GTU_01">GTU_01</option>
                <option value="GTU_02">GTU_02</option>
                <option value="none">Bez kodu</option>
              </select>
            </label>
          </fieldset>
        </div>

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.reset}
            onClick={handleReset}
          >
            Wyczyść wszystko
          </button>

          <button
            type="button"
            className={styles.apply}
            onClick={handleApply}
          >
            <SlidersHorizontal size={17} />
            Zastosuj filtry
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
