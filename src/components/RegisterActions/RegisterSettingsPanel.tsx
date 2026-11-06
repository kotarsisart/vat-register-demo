
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import styles from "./RegisterActions.module.scss";

interface Props {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onClose: () => void;
}

export function RegisterSettingsPanel({
  pageSize,
  onPageSizeChange,
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
      className={styles.settingsPanel}
      aria-labelledby="settings-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className={styles.tagsHeader}>
        <div>
          <h3 id="settings-dialog-title">Ustawienia widoku</h3>
          <p>Dostosuj sposób wyświetlania dokumentów.</p>
        </div>

        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Zamknij ustawienia"
          autoFocus
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <label className={styles.settingField}>
        Dokumentów na stronę
        <select
          value={pageSize}
          onChange={(event) =>
            onPageSizeChange(Number(event.target.value))
          }
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </label>
    </dialog>
  );
}
