import { BibleResponse } from '../types';

export const fetchChapter = async (book: string, chapter: number): Promise<BibleResponse> => {
  const response = await fetch(`https://bible-api.com/${encodeURIComponent(book)}+${chapter}`);
  if (!response.ok) {
    throw new Error('Failed to fetch chapter');
  }
  return response.json();
};

export const searchVerses = async (query: string): Promise<BibleResponse> => {
  const response = await fetch(`https://bible-api.com/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Search failed');
  }
  return response.json();
};
