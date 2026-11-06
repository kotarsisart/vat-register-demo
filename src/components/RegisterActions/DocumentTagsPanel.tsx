
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import {
  AVAILABLE_TAGS,
  type DocumentTag,
  type DocumentTags,
} from "../../hooks/useDocumentTags";
import type { VatDocument } from "../../types/document";

import styles from "./RegisterActions.module.scss";

interface Props {
  documents: VatDocument[];
  documentTags: DocumentTags;
  onToggleTag: (documentId: string, tag: DocumentTag) => void;
  onClose: () => void;
}

export function DocumentTagsPanel({
  documents,
  documentTags,
  onToggleTag,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    dialog.showModal();

    return () => {
      dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.tagsPanel}
      aria-labelledby="tags-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.tagsHeader}>
        <div>
          <h3 id="tags-dialog-title">Tagi dokumentów</h3>
          <p>Zmiany zapisują się automatycznie.</p>
        </div>

        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Zamknij panel tagów"
          autoFocus
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      {documents.length === 0 ? (
        <p>Brak dokumentów do oznaczenia.</p>
      ) : (
        <div className={styles.tagList}>
          {documents.map((document) => (
            <div className={styles.tagDocument} key={document.id}>
              <strong>{document.documentNumber}</strong>
              <span>{document.contractor}</span>

              <div className={styles.tagOptions}>
                {AVAILABLE_TAGS.map((tag) => (
                  <label key={tag}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={(documentTags[document.id] ?? []).includes(tag)}
                      onChange={() => onToggleTag(document.id, tag)}
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </dialog>
  );
}
