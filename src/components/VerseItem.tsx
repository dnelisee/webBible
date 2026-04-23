import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Bookmark, Heart, MessageSquare } from 'lucide-react';
import { Verse } from '../types';

interface VerseItemProps {
  verse: Verse;
}

export const VerseItem: React.FC<VerseItemProps> = ({ verse }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      className="relative group mb-8 p-4 hover:bg-bible-hover dark:hover:bg-zinc-900 rounded-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-4 items-start">
        <sup className="text-[11px] font-sans font-bold text-bible-gray pt-2 select-none w-6 shrink-0">
          {verse.verse}
        </sup>
        <div className="flex-1">
          <p className="bible-text text-bible-ink leading-[1.8]">
            {verse.text.trim()}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: -24 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-6 right-4 flex items-center gap-1 bg-bible-accent text-white p-1 rounded-full shadow-2xl z-10"
          >
            <ActionButton icon={<Heart className="w-4 h-4" />} id={`like-${verse.verse}`} />
            <ActionButton icon={<Bookmark className="w-4 h-4" />} id={`save-${verse.verse}`} />
            <ActionButton icon={<MessageSquare className="w-4 h-4" />} id={`note-${verse.verse}`} />
            <ActionButton icon={<Share2 className="w-4 h-4" />} id={`share-${verse.verse}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ActionButton = ({ icon, id }: { icon: React.ReactNode, id: string }) => (
  <button 
    id={id}
    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
  >
    {icon}
  </button>
);
