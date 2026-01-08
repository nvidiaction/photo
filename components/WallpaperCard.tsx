
import React, { useState } from 'react';
import { Wallpaper } from '../types';
import { MD3_COLORS } from '../constants';
import { ImageOff } from 'lucide-react';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  onClick: (wp: Wallpaper) => void;
}

const WallpaperCard: React.FC<WallpaperCardProps> = ({ wallpaper, onClick }) => {
  const [error, setError] = useState(false);

  return (
    <div 
      className="group relative flex flex-col bg-[#f3edf7] rounded-[28px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={() => onClick(wallpaper)}
    >
      <div className="aspect-[16/10] overflow-hidden bg-[#e6e0e9] flex items-center justify-center">
        {error ? (
          <div className="flex flex-col items-center gap-2 text-[#49454f]">
            <ImageOff size={32} strokeWidth={1.5} />
            <span className="text-xs">图片暂时无法加载</span>
          </div>
        ) : (
          <img 
            src={wallpaper.url} 
            alt={wallpaper.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={() => setError(true)}
          />
        )}
      </div>
      
      <div className="p-4 flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <h3 className="text-base font-medium text-[#1d1b20] line-clamp-1">
            {wallpaper.title}
          </h3>
          <span className="text-[10px] text-[#49454f] bg-[#e7e0eb] px-2 py-0.5 rounded-full font-bold">
            {wallpaper.date.slice(0, 4)}-{wallpaper.date.slice(4, 6)}-{wallpaper.date.slice(6, 8)}
          </span>
        </div>
        <p className="text-sm text-[#49454f] line-clamp-1 italic font-light opacity-80">
          {wallpaper.copyright}
        </p>
      </div>

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
    </div>
  );
};

export default WallpaperCard;
