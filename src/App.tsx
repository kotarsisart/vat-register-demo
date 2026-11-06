import { useState } from "react";

import { allDocuments } from "./data/documents";
import type { DataStatus, RegisterType } from "./types/document";

import { RegisterFilters } from "./components/RegisterFilters/RegisterFilters";
import type { FilterValues } from "./components/RegisterFilters/RegisterFilters";
import { RegisterSummary } from "./components/RegisterSummary/RegisterSummary";
import { DocumentTable } from "./components/DocumentTable/DocumentTable";
import { VatBreakdown } from "./components/VatBreakdown/VatBreakdown";
import { RegisterActions } from "./components/RegisterActions/RegisterActions";
import { DemoControls } from "./components/DemoControls/DemoControls";
import { DataError } from "./components/DataError/DataError";
import { RegisterContext } from "./components/RegisterContext/RegisterContext";
import { PrintableRegister } from "./components/PrintableRegister/PrintableRegister";

import { calculateSummary } from "./utils/calculateSummary";
import { calculateVatBreakdown } from "./utils/calculateVatBreakdown";
import { useDocumentTags } from "./hooks/useDocumentTags";

import styles from "./App.module.scss";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./hooks/useTheme";

const initialFilters: FilterValues = {
  year: "",
  month: "",
  type: "",
  vatCode: "",
  series: "",
};

function App() {
  const [register, setRegister] = useState<RegisterType>("sales");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [dataStatus, setDataStatus] = useState<DataStatus>("filled");
  const { theme, toggleTheme } = useTheme();

  const [pageSize, setPageSize] = useState<number>(() => {
    try {
      const saved = Number(localStorage.getItem("vat-register-page-size"));

      return [5, 10, 20].includes(saved) ? saved : 10;
    } catch {
      return 10;
    }
  });

  function handlePageSizeChange(size: number) {
    setPageSize(size);

    try {
      localStorage.setItem("vat-register-page-size", String(size));
    } catch {
      // localStorage is optional; the setting still works for this session.
    }
  }

  const { documentTags, toggleTag } = useDocumentTags();

  function changeRegister(nextRegister: RegisterType) {
    if (nextRegister === register) return;

    setRegister(nextRegister);
    setSearch("");
    setFilters(initialFilters);
  }

  const query = search.trim().toLocaleLowerCase("pl-PL");

  const filteredDocuments = allDocuments.filter((document) => {
    if (document.register !== register) return false;

    if (filters.year && !document.date.startsWith(filters.year)) {
      return false;
    }

    if (filters.month && document.date.slice(5, 7) !== filters.month) {
      return false;
    }

    if (filters.type && document.type !== filters.type) {
      return false;
    }

    if (filters.vatCode === "none" && document.vatCode !== null) {
      return false;
    }

    if (
      filters.vatCode &&
      filters.vatCode !== "none" &&
      document.vatCode !== filters.vatCode
    ) {
      return false;
    }

    if (filters.series && document.series !== filters.series) {
      return false;
    }

    if (!query) return true;

    const searchableFields = [
      document.contractor,
      document.documentNumber,
      document.identifier,
      document.ksefNumber ?? "",
    ];

    const isShortNumericQuery = /^\d{1,2}$/.test(query);

    if (isShortNumericQuery) {
      const lastNumber = document.documentNumber.match(/(\d+)$/)?.[1];

      return lastNumber !== undefined &&
        Number(lastNumber) === Number(query);
    }

    return searchableFields.some((value) =>
      value.toLocaleLowerCase("pl-PL").includes(query),
    );
  });

  const visibleDocuments =
    dataStatus === "filled" ? filteredDocuments : [];

  const summary = calculateSummary(visibleDocuments);
  const vatBreakdown = calculateVatBreakdown(visibleDocuments);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.screenContent}>
          <header className={styles.header}>
            <div>
              <h1 className={styles.title}>Rejestry i VAT</h1>
              <p className={styles.description}>
                Przegląd dokumentów i rozliczeń VAT
              </p>
            </div>

            <button
              type="button"
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={
                theme === "dark" ? "Włącz jasny motyw" : "Włącz ciemny motyw"
              }
              title={theme === "dark" ? "Jasny motyw" : "Ciemny motyw"}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </header>

          <RegisterContext />

          <div
            className={styles.tabs}
            role="group"
            aria-label="Rodzaj rejestru"
          >
            <button
              type="button"
              className={
                register === "sales" ? styles.activeTab : styles.tab
              }
              aria-pressed={register === "sales"}
              onClick={() => changeRegister("sales")}
            >
              Sprzedaż
            </button>

            <button
              type="button"
              className={
                register === "purchases" ? styles.activeTab : styles.tab
              }
              aria-pressed={register === "purchases"}
              onClick={() => changeRegister("purchases")}
            >
              Zakupy
            </button>
          </div>

          <DemoControls
            status={dataStatus}
            onStatusChange={setDataStatus}
          />

          {dataStatus === "error" ? (
            <DataError onRetry={() => setDataStatus("filled")} />
          ) : (
            <>
              <div className={styles.toolbar}>
                <label className={styles.search}>
                  <span className={styles.visuallyHidden}>
                    Szukaj dokumentów
                  </span>

                  <input
                    type="search"
                    name="documentSearch"
                    placeholder="Szukaj kontrahenta lub dokumentu..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </label>

                <RegisterActions
                  documents={visibleDocuments}
                  documentTags={documentTags}
                  onToggleTag={toggleTag}
                  pageSize={pageSize}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>

              <RegisterFilters
                filters={filters}
                onChange={setFilters}
                onReset={() => {
                  setFilters(initialFilters);
                  setSearch("");
                }}
              />

              <RegisterSummary summary={summary} />

              <VatBreakdown items={vatBreakdown} />

              <DocumentTable
                key={`${register}-${search}-${JSON.stringify(filters)}-${pageSize}`}
                documents={visibleDocuments}
                pageSize={pageSize}
                emptyMessage={
                  dataStatus === "empty"
                    ? "Brak dokumentów w rejestrze."
                    : "Nie znaleziono dokumentów spełniających kryteria."
                }
              />
            </>
          )}
        </div>

        <PrintableRegister
          register={register}
          documents={visibleDocuments}
          dataStatus={dataStatus}
        />
      </div>
    </main>
  );
}

export default App;
