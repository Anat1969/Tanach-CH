import { BOOKS } from './books';
import { STORY_CHAPTERS } from './chapters';
import type { Story } from '../types';

// Stories in the order of the text: the book in the traditional order, then the chapter.
export const storyOrder = (id: string): number => {
  const c = STORY_CHAPTERS[id];
  if (!c) return Number.MAX_SAFE_INTEGER;
  const book = BOOKS.findIndex((b) => b.id === c.book);
  return book * 1000 + c.from;
};

export const orderStories = (list: Story[]): Story[] => [...list].sort((a, b) => storyOrder(a.id) - storyOrder(b.id));
