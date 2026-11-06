
import { useEffect, useRef, useState } from "react";
import {
  Download,
  MoreHorizontal,
  Printer,
  Tags,
  Settings,
} from "lucide-react";

import type { VatDocument } from "../../types/document";
import type {
  DocumentTag,
  DocumentTags,
} from "../../hooks/useDocumentTags";

import { exportCsv } from "../../utils/exportCsv";
import { DocumentTagsPanel } from "./DocumentTagsPanel";
import { RegisterSettingsPanel } from "./RegisterSettingsPanel";

import styles from "./RegisterActions.module.scss";

interface Props {
  documents: VatDocument[];
  documentTags: DocumentTags;
  onToggleTag: (documentId: string, tag: DocumentTag) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

type ActivePanel = "tags" | "settings" | null;

export function RegisterActions({
  documents,
  documentTags,
  onToggleTag,
  pageSize,
  onPageSizeChange,
}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  function closePanel() {
    setActivePanel(null);

    requestAnimationFrame(() => {
      menuButtonRef.current?.focus();
    });
  }

  function openPanel(panel: Exclude<ActivePanel, null>) {
    setIsMenuOpen(false);
    setActivePanel(panel);
  }

  function handleExport() {
    exportCsv(documents);
    setIsMenuOpen(false);
  }

  function handlePrint() {
    setIsMenuOpen(false);
    window.print();
  }

  return (
    <>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primaryAction}
          onClick={handleExport}
          disabled={documents.length === 0}
        >
          <Download size={18} aria-hidden="true" />
          <span>Eksport CSV</span>
        </button>

        <div ref={menuRef} className={styles.menuWrapper}>
          <button
            ref={menuButtonRef}
            type="button"
            className={styles.menuToggle}
            aria-label="Więcej działań"
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <MoreHorizontal size={20} aria-hidden="true" />
          </button>

          {isMenuOpen && (
            <div className={styles.menu}>
              <button type="button" onClick={handlePrint}>
                <Printer size={17} aria-hidden="true" />
                Drukuj
              </button>

              <button
                type="button"
                onClick={() => openPanel("tags")}
              >
                <Tags size={17} aria-hidden="true" />
                Tagi
              </button>

              <button
                type="button"
                onClick={() => openPanel("settings")}
              >
                <Settings size={17} aria-hidden="true" />
                Ustawienia
              </button>
            </div>
          )}
        </div>
      </div>

      {activePanel === "tags" && (
        <DocumentTagsPanel
          documents={documents}
          documentTags={documentTags}
          onToggleTag={onToggleTag}
          onClose={closePanel}
        />
      )}

      {activePanel === "settings" && (
        <RegisterSettingsPanel
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          onClose={closePanel}
        />
      )}
    </>
  );
}
