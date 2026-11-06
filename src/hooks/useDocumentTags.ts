
import { useState } from "react";

export const AVAILABLE_TAGS = [
  "Do sprawdzenia",
  "Pilne",
  "Zatwierdzone",
] as const;

export type DocumentTag = (typeof AVAILABLE_TAGS)[number];

export type DocumentTags = Record<string, DocumentTag[]>;

const STORAGE_KEY = "vat-register-document-tags";

function readStoredTags(): DocumentTags {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return {};

    const parsed: unknown = JSON.parse(stored);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    const result: DocumentTags = {};

    for (const [id, tags] of Object.entries(parsed)) {
      if (!Array.isArray(tags)) continue;

      result[id] = tags.filter(
        (tag): tag is DocumentTag =>
          typeof tag === "string" &&
          AVAILABLE_TAGS.some((available) => available === tag),
      );
    }

    return result;
  } catch {
    return {};
  }
}

export function useDocumentTags() {
  const [documentTags, setDocumentTags] = useState<DocumentTags>(readStoredTags);

  function toggleTag(documentId: string, tag: DocumentTag) {
    setDocumentTags((current) => {
      const existing = current[documentId] ?? [];

      const nextTags = existing.includes(tag)
        ? existing.filter((item) => item !== tag)
        : [...existing, tag];

      const next = { ...current, [documentId]: nextTags };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // The markers will continue to work until the page is refreshed.
      }

      return next;
    });
  }

  return { documentTags, toggleTag };
}
