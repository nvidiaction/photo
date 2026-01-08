
import React, { useState, useRef, useEffect } from 'react';
import { MD3_COLORS } from '../constants';
import { Search, MoreVertical, Menu, ArrowLeft, X, ExternalLink, Info, Trash2 } from 'lucide-react';

interface TopAppBarProps {
  onMenuClick?: () => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

const TopAppBar: React.FC<TopAppBarProps> = ({ onMenuClick, onSearch, searchQuery = '' }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearching]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) onSearch(e.target.value);
  };

  const clearSearch = () => {
    if (onSearch) onSearch('');
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  return (
    <header className={`sticky top-0 z-50 w-full px-4 h-16 flex items-center transition-all duration-300 ${isSearching ? 'bg-[#fdf7ff]' : 'bg-[#fdf7ff]/80 backdrop-blur-md'}`}>
      {isSearching ? (
        <div className="flex items-center w-full gap-2 animate-in slide-in-from-right-4 duration-300">
          <button 
            onClick={() => { setIsSearching(false); onSearch?.(''); }}
            className="p-3 hover:bg-[#e7e0eb] rounded-full transition-colors"
          >
            <ArrowLeft size={24} color={MD3_COLORS.onSurface} />
          </button>
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="搜索壁纸标题、摄影师..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-grow bg-transparent border-none outline-none text-lg text-[#1d1b20] placeholder-[#49454f]"
          />
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className="p-3 hover:bg-[#e7e0eb] rounded-full transition-colors"
            >
              <X size={24} color={MD3_COLORS.onSurface} />
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between w-full animate-in fade-in duration-300">
          <div className="flex items-center gap-4">
            <button 
              onClick={onMenuClick}
              className="p-3 hover:bg-[#e7e0eb] rounded-full transition-colors duration-200"
              aria-label="菜单"
            >
              <Menu size={24} color={MD3_COLORS.onSurface} />
            </button>
            <h1 className="text-[22px] leading-7 font-normal text-[#1d1b20] tracking-tight">
              Lumina 必应壁纸
            </h1>
          </div>
          
          <div className="flex items-center gap-1 relative">
            <button 
              onClick={() => setIsSearching(true)}
              className="p-3 hover:bg-[#e7e0eb] rounded-full transition-colors" 
              aria-label="搜索"
            >
              <Search size={24} color={MD3_COLORS.onSurface} />
            </button>
            
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="p-3 hover:bg-[#e7e0eb] rounded-full transition-colors" 
                aria-label="更多"
              >
                <MoreVertical size={24} color={MD3_COLORS.onSurface} />
              </button>

              {isMoreMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#f3edf7] rounded-[14px] shadow-xl border border-[#e7e0eb] py-2 z-[60] animate-in zoom-in-95 duration-200 origin-top-right">
                  <button className="w-full px-4 py-3 flex items-center gap-4 hover:bg-[#6750A4]/5 text-[#1d1b20] transition-colors">
                    <Info size={20} className="text-[#49454f]" />
                    <span className="text-sm font-medium">关于项目</span>
                  </button>
                  <button 
                    onClick={() => { localStorage.clear(); window.location.reload(); }}
                    className="w-full px-4 py-3 flex items-center gap-4 hover:bg-[#6750A4]/5 text-[#1d1b20] transition-colors"
                  >
                    <Trash2 size={20} className="text-[#ba1a1a]" />
                    <span className="text-sm font-medium text-[#ba1a1a]">重置数据</span>
                  </button>
                  <div className="my-1 border-t border-[#e7e0eb]"></div>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full px-4 py-3 flex items-center gap-4 hover:bg-[#6750A4]/5 text-[#1d1b20] transition-colors"
                  >
                    <ExternalLink size={20} className="text-[#49454f]" />
                    <span className="text-sm font-medium">访问 GitHub</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopAppBar;
