import React from 'react';
import { Menu, Moon, Sun, Search, Settings } from 'lucide-react';
import { Theme } from '../types';

interface HeaderProps {
  currentReference: string;
  onOpenNav: () => void;
  theme: Theme;
  toggleTheme: () => void;
  isHidden: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentReference, 
  onOpenNav, 
  theme, 
  toggleTheme,
  isHidden
}) => {
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 glass transition-transform duration-300 ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-bible-accent rounded flex items-center justify-center">
              <div className="w-1 h-4 bg-white rounded-full rotate-12"></div>
              <div className="w-1 h-4 bg-white rounded-full -rotate-12"></div>
            </div>
            <span className="font-semibold tracking-tight text-lg hidden sm:inline">SCRIPTURA</span>
          </div>

          <button 
            onClick={onOpenNav}
            className="flex items-center gap-2 px-4 py-1.5 bg-bible-hover dark:bg-zinc-800 rounded-full text-sm font-medium hover:opacity-80 transition-all border border-bible-muted/50"
            id="nav-trigger"
          >
            <Menu className="w-4 h-4" />
            <span>{currentReference}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-bible-muted rounded-lg text-xs bg-white dark:bg-zinc-900 cursor-pointer hover:border-bible-accent transition-colors">
            <span className="font-medium opacity-70">Louis Segond 1910</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-bible-hover dark:bg-zinc-800 flex items-center justify-center hover:bg-bible-muted transition-colors"
              id="theme-toggle"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button className="w-10 h-10 rounded-full bg-bible-hover dark:bg-zinc-800 flex items-center justify-center hover:bg-bible-muted transition-colors md:hidden" id="search-btn">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
