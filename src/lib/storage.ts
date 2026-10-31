// Journal notes live in this browser only. Every access is guarded: private windows can block storage.
export interface JournalEntry {
  text: string;
  updated: string;
}
export type Journal = Record<string, JournalEntry>;

const KEY = 'tanach.journal.v1';

export function loadJournal(): Journal {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Journal) : {};
  } catch {
    return {};
  }
}

export function saveJournal(journal: Journal): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(journal));
    return true;
  } catch {
    return false;
  }
}
