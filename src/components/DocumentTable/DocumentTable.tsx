
import { useState } from "react";

import { getDocumentView } from "../../utils/documentView";
import type { VatDocument } from "../../types/document";
import { DesktopTable } from "./DesktopTable";
import { MobileDocumentList } from "./MobileDocumentList";

import styles from "./DocumentTable.module.scss";

interface Props {
  documents: VatDocument[];
  pageSize: number;
  emptyMessage?: string;
}

export function DocumentTable({
  documents,
  pageSize,
  emptyMessage = "Nie znaleziono dokumentów.",
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(documents.length / pageSize),
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedDocuments = documents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function changePage(nextPage: number) {
    setPage(nextPage);
    setExpandedId(null);
  }

  function toggleDocument(id: string) {
    setExpandedId((current) => (current === id ? null : id));
  }

  function renderDetails(document: VatDocument) {
    const view = getDocumentView(document);

    return (
      <div className={styles.details}>
        <div>
          <span>Numer KSeF</span>
          <strong>{view.ksefNumber}</strong>
        </div>

        <div>
          <span>Identyfikator</span>
          <strong>{document.identifier}</strong>
        </div>

        <div>
          <span>Rodzaj operacji</span>
          <strong>{view.operationType}</strong>
        </div>

        <div>
          <span>Kod JPK V7</span>
          <strong>{view.vatCode}</strong>
        </div>

        <div>
          <span>Seria dokumentu</span>
          <strong>{document.series}</strong>
        </div>

        <div>
          <span>Stawka VAT</span>
          <strong>{document.vatRate}</strong>
        </div>
      </div>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2>Dokumenty</h2>
        <span>{documents.length} dokumentów</span>
      </div>

      {documents.length === 0 ? (
        <div className={styles.emptyState}>
          {emptyMessage}
        </div>
      ) : (
        <>
          <DesktopTable
            documents={paginatedDocuments}
            expandedId={expandedId}
            onToggle={toggleDocument}
            renderDetails={renderDetails}
          />

          <MobileDocumentList
            documents={paginatedDocuments}
            expandedId={expandedId}
            onToggle={toggleDocument}
            renderDetails={renderDetails}
          />
        </>
      )}

      {documents.length > 0 && totalPages > 1 && (
        <nav
          className={styles.pagination}
          aria-label="Strony dokumentów"
        >
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
          >
            Poprzednia
          </button>

          <span>
            Strona {currentPage} z {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
          >
            Następna
          </button>
        </nav>
      )}
    </section>
  );
}
