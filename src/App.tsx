import React from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { Header } from './components/Header';
import { NavigationMenu } from './components/NavigationMenu';
import { VerseItem } from './components/VerseItem';
import { fetchChapter } from './services/bibleService';
import { BibleResponse, Theme } from './types';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { BIBLE_BOOKS } from './constants';

export default function App() {
  const [data, setData] = React.useState<BibleResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentBook, setCurrentBook] = React.useState('John');
  const [currentChapter, setCurrentChapter] = React.useState(3);
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>('light');
  const [isHeaderHidden, setIsHeaderHidden] = React.useState(false);

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);

  // Focus mode: hide header on scroll down, show on scroll up
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > lastScrollY.current && latest > 100) {
      setIsHeaderHidden(true);
    } else {
      setIsHeaderHidden(false);
    }
    lastScrollY.current = latest;
  });

  React.useEffect(() => {
    const loadChapter = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchChapter(currentBook, currentChapter);
        setData(result);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setError('Impossible de charger le texte. Réessayez plus tard.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadChapter();
  }, [currentBook, currentChapter]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark');
  };

  const handleNavigateChapter = (direction: 'next' | 'prev') => {
    const bookIndex = BIBLE_BOOKS.findIndex(b => b.name === currentBook);
    const book = BIBLE_BOOKS[bookIndex];

    if (direction === 'next') {
      if (currentChapter < book.chapters) {
        setCurrentChapter(prev => prev + 1);
      } else if (bookIndex < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[bookIndex + 1];
        setCurrentBook(nextBook.name);
        setCurrentChapter(1);
      }
    } else {
      if (currentChapter > 1) {
        setCurrentChapter(prev => prev - 1);
      } else if (bookIndex > 0) {
        const prevBook = BIBLE_BOOKS[bookIndex - 1];
        setCurrentBook(prevBook.name);
        setCurrentChapter(prevBook.chapters);
      }
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <Header 
        currentReference={data?.reference || `${currentBook} ${currentChapter}`}
        onOpenNav={() => setIsNavOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        isHidden={isHeaderHidden}
      />

      <main className="max-w-[720px] mx-auto px-6 pt-32 sm:pt-40">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
            <Loader2 className="w-8 h-8 animate-spin text-bible-accent" />
            <p className="text-sm font-medium animate-pulse">Préparation du texte...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium">{error}</p>
            <button 
              onClick={() => setCurrentChapter(currentChapter)}
              className="mt-4 px-6 py-2 bg-bible-accent text-white rounded-full text-sm font-medium"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-16 text-center">
              <h1 className="font-serif text-5xl sm:text-6xl font-medium tracking-tight mb-3">
                {currentBook} {currentChapter}
              </h1>
              <p className="text-bible-gray font-medium uppercase tracking-[0.2em] text-[10px]">
                Translation : Louis Segond 1910
              </p>
              <div className="mt-8 w-12 h-1 bg-bible-accent mx-auto opacity-10 rounded-full"></div>
            </div>

            <div className="space-y-4">
              {data?.verses.map((verse) => (
                <VerseItem key={`${verse.book_id}-${verse.chapter}-${verse.verse}`} verse={verse} />
              ))}
            </div>

            <div className="mt-24 pt-12 border-t border-bible-muted flex items-center justify-between">
              <NavigationButton 
                onClick={() => handleNavigateChapter('prev')}
                label="Précédent"
                icon={<ChevronLeft className="w-5 h-5" />}
                align="left"
              />
              <NavigationButton 
                onClick={() => handleNavigateChapter('next')}
                label="Suivant"
                icon={<ChevronRight className="w-5 h-5" />}
                align="right"
              />
            </div>
          </motion.div>
        )}
      </main>

      <NavigationMenu 
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        onSelect={(book, chap) => {
          setCurrentBook(book);
          setCurrentChapter(chap);
        }}
        currentBook={currentBook}
        currentChapter={currentChapter}
      />

      {/* Bottom Progress Bar */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-bible-muted z-[100]">
        <motion.div 
          className="h-full bg-bible-accent"
          initial={{ width: 0 }}
          animate={{ width: `${(currentChapter / (BIBLE_BOOKS.find(b => b.name === currentBook)?.chapters || 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

const NavigationButton = ({ onClick, label, icon, align }: { onClick: () => void, label: string, icon: React.ReactNode, align: 'left' | 'right' }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 group p-2 hover:bg-bible-hover rounded-2xl transition-all ${align === 'right' ? 'flex-row-reverse' : ''}`}
    id={`${align}-chap-btn`}
  >
    <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-zinc-900 border border-bible-muted rounded-xl group-hover:scale-110 group-hover:border-bible-accent group-hover:shadow-lg transition-all duration-300">
      {icon}
    </div>
    <div className={`flex flex-col ${align === 'right' ? 'items-end' : 'items-start'}`}>
      <span className="text-[10px] uppercase tracking-widest font-bold text-bible-gray opacity-60">
        Chapitre
      </span>
      <span className="font-semibold text-sm">{label}</span>
    </div>
  </button>
);
