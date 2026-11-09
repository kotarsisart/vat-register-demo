import { useEffect, useRef, useState } from "react";
import {
  ChartNoAxesCombined,
  FileText,
  MoreHorizontal,
  Moon,
  Search,
  SlidersHorizontal,
  Sun,
} from "lucide-react";

import { DataError } from "./components/DataError/DataError";
import { DemoControls } from "./components/DemoControls/DemoControls";
import { DocumentTable } from "./components/DocumentTable/DocumentTable";
import { PrintableRegister } from "./components/PrintableRegister/PrintableRegister";
import { RegisterActions } from "./components/RegisterActions/RegisterActions";
import { RegisterContext } from "./components/RegisterContext/RegisterContext";
import { RegisterFilters } from "./components/RegisterFilters/RegisterFilters";
import type { FilterValues } from "./components/RegisterFilters/RegisterFilters";
import { RegisterSummary } from "./components/RegisterSummary/RegisterSummary";
import { VatBreakdown } from "./components/VatBreakdown/VatBreakdown";

import { allDocuments } from "./data/documents";
import { useDocumentTags } from "./hooks/useDocumentTags";
import { useTheme } from "./hooks/useTheme";
import type { DataStatus, RegisterType } from "./types/document";
import { calculateSummary } from "./utils/calculateSummary";
import { calculateVatBreakdown } from "./utils/calculateVatBreakdown";

import styles from "./App.module.scss";

const initialFilters: FilterValues = {
  year: "",
  month: "",
  type: "",
  vatCode: "",
  series: "",
};

const filterLabels: Record<keyof FilterValues, string> = {
  year: "Rok",
  month: "Miesiąc",
  type: "Rodzaj",
  vatCode: "Kod JPK",
  series: "Seria",
};

const filterValueLabels: Record<string, string> = {
  invoice: "Faktura",
  correction: "Korekta",
  none: "Bez kodu",
};

type Workspace = "documents" | "analytics";

function App() {
  const [register, setRegister] = useState<RegisterType>("sales");
  const [search, setSearch] = useState("");
  const [workspace, setWorkspace] = useState<Workspace>("documents");

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>(initialFilters);

  const [dataStatus, setDataStatus] = useState<DataStatus>("filled");
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const demoMenuRef = useRef<HTMLDivElement>(null);
  const demoButtonRef = useRef<HTMLButtonElement>(null);

  const { theme, toggleTheme } = useTheme();
  const { documentTags, toggleTag } = useDocumentTags();

  const [pageSize, setPageSize] = useState<number>(() => {
    try {
      const saved = Number(
        localStorage.getItem("vat-register-page-size"),
      );

      return [5, 10, 20].includes(saved) ? saved : 10;
    } catch {
      return 10;
    }
  });

  // Close the demo menu on outside click or Escape.
  useEffect(() => {
    if (!demoMenuOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !demoMenuRef.current?.contains(event.target)
      ) {
        setDemoMenuOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDemoMenuOpen(false);
        demoButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener(
        "pointerdown",
        closeOnOutsideClick,
      );
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [demoMenuOpen]);

  // Persist the selected page size.
  function handlePageSizeChange(size: number) {
    setPageSize(size);

    try {
      localStorage.setItem(
        "vat-register-page-size",
        String(size),
      );
    } catch {
      // The setting still works if localStorage is unavailable.
    }
  }

  // Reset search and filters when switching registers.
  function changeRegister(nextRegister: RegisterType) {
    if (nextRegister === register) return;

    setRegister(nextRegister);
    setSearch("");
    setFilters(initialFilters);
  }

  function handleResetFilters() {
    setFilters(initialFilters);
    setSearch("");
  }

  function handleRemoveFilter(key: keyof FilterValues) {
    setFilters((current) => ({
      ...current,
      [key]: "",
    }));
  }

  function handleDemoStatusChange(nextStatus: DataStatus) {
    setDataStatus(nextStatus);
    setDemoMenuOpen(false);
  }

  // Apply register, field filters and search.
  const query = search.trim().toLocaleLowerCase("pl-PL");

  const filteredDocuments = allDocuments.filter((document) => {
    if (document.register !== register) return false;

    if (
      filters.year &&
      !document.date.startsWith(filters.year)
    ) {
      return false;
    }

    if (
      filters.month &&
      document.date.slice(5, 7) !== filters.month
    ) {
      return false;
    }

    if (filters.type && document.type !== filters.type) {
      return false;
    }

    if (
      filters.vatCode === "none" &&
      document.vatCode !== null
    ) {
      return false;
    }

    if (
      filters.vatCode &&
      filters.vatCode !== "none" &&
      document.vatCode !== filters.vatCode
    ) {
      return false;
    }

    if (
      filters.series &&
      document.series !== filters.series
    ) {
      return false;
    }

    if (!query) return true;

    const searchableFields = [
      document.contractor,
      document.documentNumber,
      document.identifier,
      document.ksefNumber ?? "",
    ];

    return searchableFields.some((value) =>
      value.toLocaleLowerCase("pl-PL").includes(query),
    );
  });

  const visibleDocuments =
    dataStatus === "filled" ? filteredDocuments : [];

  const summary = calculateSummary(visibleDocuments);
  const vatBreakdown = calculateVatBreakdown(visibleDocuments);

  const activeFilters = (
    Object.entries(filters) as [keyof FilterValues, string][]
  ).filter(([, value]) => Boolean(value));

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.screenContent}>
          <header className={styles.header}>
            <div>
              <h1 className={styles.title}>
                Rejestry i VAT
              </h1>

              <p className={styles.description}>
                Przegląd dokumentów i rozliczeń VAT
              </p>
            </div>

            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.themeToggle}
                onClick={toggleTheme}
                aria-label={
                  theme === "dark"
                    ? "Włącz jasny motyw"
                    : "Włącz ciemny motyw"
                }
                title={
                  theme === "dark"
                    ? "Jasny motyw"
                    : "Ciemny motyw"
                }
              >
                {theme === "dark" ? (
                  <Sun size={20} />
                ) : (
                  <Moon size={20} />
                )}
              </button>

              <div
                ref={demoMenuRef}
                className={styles.demoMenuWrapper}
              >
                <button
                  ref={demoButtonRef}
                  type="button"
                  className={styles.themeToggle}
                  aria-label="Opcje demonstracyjne"
                  aria-haspopup="true"
                  aria-expanded={demoMenuOpen}
                  onClick={() =>
                    setDemoMenuOpen((open) => !open)
                  }
                >
                  <MoreHorizontal
                    size={20}
                    aria-hidden="true"
                  />
                </button>

                {demoMenuOpen && (
                  <div className={styles.demoMenu}>
                    <DemoControls
                      status={dataStatus}
                      onStatusChange={handleDemoStatusChange}
                    />
                  </div>
                )}
              </div>
            </div>
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
                register === "sales"
                  ? styles.activeTab
                  : styles.tab
              }
              aria-pressed={register === "sales"}
              onClick={() => changeRegister("sales")}
            >
              Sprzedaż
            </button>

            <button
              type="button"
              className={
                register === "purchases"
                  ? styles.activeTab
                  : styles.tab
              }
              aria-pressed={register === "purchases"}
              onClick={() => changeRegister("purchases")}
            >
              Zakupy
            </button>
          </div>

          {dataStatus === "error" ? (
            <DataError
              onRetry={() => setDataStatus("filled")}
            />
          ) : (
            <>
              <div className={styles.workspaceHeader}>
                <div
                  className={styles.workspaceTabs}
                  role="group"
                  aria-label="Widok rejestru"
                >
                  <button
                    type="button"
                    className={
                      workspace === "documents"
                        ? styles.workspaceActive
                        : styles.workspaceTab
                    }
                    aria-pressed={workspace === "documents"}
                    onClick={() =>
                      setWorkspace("documents")
                    }
                  >
                    <FileText
                      size={18}
                      aria-hidden="true"
                    />
                    Dokumenty
                  </button>

                  <button
                    type="button"
                    className={
                      workspace === "analytics"
                        ? styles.workspaceActive
                        : styles.workspaceTab
                    }
                    aria-pressed={workspace === "analytics"}
                    onClick={() =>
                      setWorkspace("analytics")
                    }
                  >
                    <ChartNoAxesCombined
                      size={18}
                      aria-hidden="true"
                    />
                    Analityka
                  </button>
                </div>

                <button
                  type="button"
                  className={styles.filterButton}
                  onClick={() => setFiltersOpen(true)}
                >
                  <SlidersHorizontal
                    size={18}
                    aria-hidden="true"
                  />

                  Filtry

                  {activeFilters.length > 0 && (
                    <span className={styles.filterCount}>
                      {activeFilters.length}
                    </span>
                  )}
                </button>
              </div>

              <RegisterFilters
                key={filtersOpen ? "open" : "closed"}
                open={filtersOpen}
                onClose={() => setFiltersOpen(false)}
                filters={filters}
                onChange={setFilters}
                onReset={handleResetFilters}
              />

              {activeFilters.length > 0 && (
                <div
                  className={styles.activeFilters}
                  aria-label="Aktywne filtry"
                >
                  {activeFilters.map(([key, value]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        handleRemoveFilter(key)
                      }
                      title="Usuń filtr"
                    >
                      {filterLabels[key]}: {filterValueLabels[value] ?? value} ×
                    </button>
                  ))}
                </div>
              )}

              {workspace === "documents" ? (
                <div className={styles.workspacePanel}>
                  <div className={styles.toolbar}>
                    <label className={styles.search}>
                      <Search
                        size={19}
                        aria-hidden="true"
                      />

                      <span
                        className={styles.visuallyHidden}
                      >
                        Szukaj dokumentów
                      </span>

                      <input
                        type="search"
                        name="documentSearch"
                        placeholder="Szukaj kontrahenta lub dokumentu..."
                        value={search}
                        onChange={(event) =>
                          setSearch(event.target.value)
                        }
                      />
                    </label>

                    <RegisterActions
                      documents={visibleDocuments}
                      documentTags={documentTags}
                      onToggleTag={toggleTag}
                      pageSize={pageSize}
                      onPageSizeChange={
                        handlePageSizeChange
                      }
                    />
                  </div>

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
                </div>
              ) : (
                <div className={styles.analyticsLayout}>
                  <RegisterSummary summary={summary} />

                  <VatBreakdown items={vatBreakdown} />

                  <p className={styles.analyticsNote}>
                    Zestawienie na podstawie{" "}
                    {visibleDocuments.length} dokumentów.
                    Zmiana filtrów aktualizuje wszystkie
                    wartości.
                  </p>
                </div>
              )}
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
