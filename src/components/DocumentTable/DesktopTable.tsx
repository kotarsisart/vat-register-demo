
import { Fragment } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ReactNode } from "react";

import type { VatDocument } from "../../types/document";
import { getDocumentView } from "../../utils/documentView";

import styles from "./DocumentTable.module.scss";

interface Props {
  documents: VatDocument[];
  expandedId: string | null;
  onToggle: (id: string) => void;
  renderDetails: (document: VatDocument) => ReactNode;
}

export function DesktopTable({
  documents,
  expandedId,
  onToggle,
  renderDetails,
}: Props) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Kontrahent</th>
            <th scope="col">Data</th>
            <th scope="col">Numer dokumentu</th>
            <th scope="col">Netto</th>
            <th scope="col">VAT</th>
            <th scope="col">Brutto</th>
            <th scope="col">
              <span className={styles.visuallyHidden}>
                Szczegóły
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {documents.map((document) => {
            const isExpanded = expandedId === document.id;
            const detailsId = `desktop-details-${document.id}`;
            const view = getDocumentView(document);

            return (
              <Fragment key={document.id}>
                <tr
                  className={styles.clickableRow}
                  onClick={() => onToggle(document.id)}
                  data-expanded={isExpanded}
                >
                  <td>{document.contractor}</td>
                  <td>{document.date}</td>
                  <td>{document.documentNumber}</td>
                  <td>{view.net}</td>
                  <td>{view.vat}</td>
                  <td>{view.gross}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.expandButton}
                      aria-expanded={isExpanded}
                      aria-controls={detailsId}
                      aria-label={`${
                        isExpanded ? "Zwiń" : "Rozwiń"
                      } szczegóły dokumentu ${document.documentNumber}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggle(document.id);
                      }}
                    >
                      {isExpanded ? (
                        <ChevronUp size={18} aria-hidden="true" />
                      ) : (
                        <ChevronDown size={18} aria-hidden="true" />
                      )}
                    </button>
                  </td>
                </tr>

                <tr className={styles.detailsRow}>
                  <td colSpan={7}>
                    <div
                      id={detailsId}
                      className={styles.detailsAnimation}
                      data-expanded={isExpanded}
                      inert={!isExpanded}
                    >
                      <div className={styles.detailsAnimationInner}>
                        {renderDetails(document)}
                      </div>
                    </div>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
