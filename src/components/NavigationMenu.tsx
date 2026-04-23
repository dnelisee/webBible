import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight } from 'lucide-react';
import { BIBLE_BOOKS } from '../constants';
import { Book } from '../types';

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (book: string, chapter: number) => void;
  currentBook: string;
  currentChapter: number;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ 
  isOpen, 
  onClose, 
  onSelect,
  currentBook,
  currentChapter
}) => {
  const [selectedBook, setSelectedBook] = React.useState<Book | null>(
    BIBLE_BOOKS.find(b => b.name === currentBook) || null
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-bible-bg shadow-2xl z-[101] flex flex-col p-6 overflow-hidden border-l border-bible-muted"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-serif font-medium tracking-tight">
                  {selectedBook ? selectedBook.name : 'Bibliothèque'}
                </h2>
                {!selectedBook && <p className="text-xs text-bible-gray uppercase tracking-widest font-bold mt-1">Sélecteur de livres</p>}
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center hover:bg-bible-hover rounded-full transition-colors border border-bible-muted"
                id="close-nav"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {!selectedBook ? (
                <div className="grid grid-cols-1 gap-3">
                  {BIBLE_BOOKS.map((book) => (
                    <button
                      key={book.name}
                      onClick={() => setSelectedBook(book)}
                      className={`bento-card p-4 text-left group flex justify-between items-center ${
                        book.name === currentBook ? 'bg-zinc-100 dark:bg-zinc-800 border-bible-accent' : ''
                      }`}
                      id={`book-${book.name.replace(/\s/g, '-')}`}
                    >
                      <div>
                        <div className="text-sm font-semibold mb-0.5">{book.name}</div>
                        <div className="text-[10px] text-bible-gray uppercase tracking-wider">{book.chapters} chapitres</div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <button 
                    onClick={() => setSelectedBook(null)}
                    className="mb-6 py-2 px-4 bg-bible-hover dark:bg-zinc-800 rounded-full text-xs font-bold uppercase tracking-widest text-bible-ink flex items-center gap-2 hover:opacity-80 transition-all border border-bible-muted"
                    id="back-to-books"
                  >
                    ← Liste des livres
                  </button>
                  
                  <label className="text-[10px] uppercase tracking-widest text-bible-gray font-bold block mb-4">Chapitres disponibles</label>
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chap) => (
                      <button
                        key={chap}
                        onClick={() => {
                          onSelect(selectedBook.name, chap);
                          onClose();
                        }}
                        className={`aspect-square flex items-center justify-center text-sm font-medium rounded-xl border transition-all ${
                          selectedBook.name === currentBook && chap === currentChapter
                            ? 'bg-bible-accent border-bible-accent text-white shadow-lg'
                            : 'border-bible-muted bg-white dark:bg-zinc-900 hover:border-bible-accent'
                        }`}
                        id={`chapter-${chap}`}
                      >
                        {chap}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
