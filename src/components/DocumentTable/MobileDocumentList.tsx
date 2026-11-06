
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

export function MobileDocumentList({
  documents,
  expandedId,
  onToggle,
  renderDetails,
}: Props) {
  return (
    <div className={styles.mobileList}>
      {documents.map((document) => {
        const isExpanded = expandedId === document.id;
        const detailsId = `mobile-details-${document.id}`;
        const view = getDocumentView(document);

        return (
          <article className={styles.card} key={document.id}>
            <button
              type="button"
              className={styles.cardTrigger}
              aria-expanded={isExpanded}
              aria-controls={detailsId}
              aria-label={`${
                isExpanded ? "Zwiń" : "Rozwiń"
              } szczegóły dokumentu ${document.documentNumber}`}
              onClick={() => onToggle(document.id)}
            >
              <div className={styles.cardTop}>
                <div className={styles.cardInfo}>
                  <strong className={styles.contractor}>
                    {document.contractor}
                  </strong>

                  <span className={styles.documentNumber}>
                    {document.documentNumber}
                  </span>

                  <span className={styles.date}>
                    {document.date}
                  </span>
                </div>

                <span className={styles.expandButton} aria-hidden="true">
                  {isExpanded ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </span>
              </div>

              <div className={styles.cardAmounts}>
                <div>
                  <span>Netto</span>
                  <strong>{view.net}</strong>
                </div>

                <div>
                  <span>VAT</span>
                  <strong>{view.vat}</strong>
                </div>

                <div>
                  <span>Brutto</span>
                  <strong>{view.gross}</strong>
                </div>
              </div>
            </button>

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
          </article>
        );
      })}
    </div>
  );
}
