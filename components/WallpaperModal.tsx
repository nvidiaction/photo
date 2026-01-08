
import React, { useEffect, useState } from 'react';
import { Wallpaper } from '../types';
import { X, Download, Share2, Heart, Sparkles, ImageOff, CheckCircle2 } from 'lucide-react';
import { MD3_COLORS } from '../constants';
import { getWallpaperStory } from '../services/geminiService';

interface WallpaperModalProps {
  wallpaper: Wallpaper | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const WallpaperModal: React.FC<WallpaperModalProps> = ({ wallpaper, onClose, isFavorite, onToggleFavorite }) => {
  const [story, setStory] = useState<string>('正在为您生成 AI 深度解读...');
  const [loadingStory, setLoadingStory] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  useEffect(() => {
    if (wallpaper) {
      setImageError(false);
      setLoadingStory(true);
      getWallpaperStory(wallpaper.title, wallpaper.copyright).then(res => {
        setStory(res);
        setLoadingStory(false);
      });
    } else {
      setStory('正在为您生成 AI 深度解读...');
    }
  }, [wallpaper]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownload = async () => {
    if (!wallpaper) return;
    try {
      showToast('正在准备下载...', 'info');
      const response = await fetch(wallpaper.hdUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Lumina-${wallpaper.title.replace(/\s+/g, '-')}-${wallpaper.date}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast('下载已开始');
    } catch (err) {
      // Fallback: Open in new tab if blob download fails
      window.open(wallpaper.hdUrl, '_blank');
      showToast('已在新标签页打开高清图');
    }
  };

  const handleShare = async () => {
    if (!wallpaper) return;
    const shareData = {
      title: `Lumina 壁纸: ${wallpaper.title}`,
      text: `来看看这张精美的必应每日壁纸: ${wallpaper.title}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (!wallpaper) return;
    navigator.clipboard.writeText(wallpaper.hdUrl).then(() => {
      showToast('链接已复制到剪贴板');
    });
  };

  if (!wallpaper) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[110] bg-[#1d1b20] text-[#fdf7ff] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={18} className="text-[#eaddff]" />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div className="relative w-full h-full md:max-w-5xl md:max-h-[90vh] bg-[#fdf7ff] md:rounded-[28px] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors md:bg-transparent md:text-[#1d1b20] md:hover:bg-[#e7e0eb]"
        >
          <X size={24} />
        </button>

        <div className="relative flex-[1.5] bg-black flex items-center justify-center overflow-hidden">
          {imageError ? (
            <div className="flex flex-col items-center gap-4 text-white/60">
              <ImageOff size={64} strokeWidth={1} />
              <p>高清原图加载失败</p>
            </div>
          ) : (
            <img 
              src={wallpaper.hdUrl} 
              alt={wallpaper.title}
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col gap-6 bg-[#fdf7ff]">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-[#1d1b20] leading-tight">
              {wallpaper.title}
            </h2>
            <p className="text-[#49454f] text-sm leading-snug">
              {wallpaper.copyright}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#6750A4] text-white rounded-full hover:shadow-md transition-all active:scale-95"
            >
              <Download size={18} />
              <span className="font-medium text-sm">下载高清</span>
            </button>
            <button 
              onClick={handleShare}
              className="p-2.5 border border-[#79747E] text-[#6750A4] rounded-full hover:bg-[#6750A4]/5 transition-colors active:scale-90"
              title="分享图片链接"
            >
              <Share2 size={18} />
            </button>
            <button 
              onClick={() => {
                onToggleFavorite();
                showToast(isFavorite ? '已从收藏夹移除' : '已添加到收藏夹');
              }}
              className={`p-2.5 border border-[#79747E] rounded-full transition-all active:scale-90 ${isFavorite ? 'bg-[#ba1a1a]/10 border-[#ba1a1a] text-[#ba1a1a]' : 'text-[#6750A4] hover:bg-[#6750A4]/5'}`}
              title={isFavorite ? '取消收藏' : '添加到收藏'}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="bg-[#eaddff] p-5 rounded-[24px] flex flex-col gap-2 relative overflow-hidden">
            <div className="flex items-center gap-2 text-[#21005d] mb-1">
              <Sparkles size={18} className="animate-pulse" />
              <span className="font-bold text-xs tracking-wider uppercase">AI 故事解读</span>
            </div>
            <p className={`text-[#21005d] text-sm leading-relaxed ${loadingStory ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
              {story}
            </p>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#6750A4]/10 rounded-full blur-2xl" />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 py-2 border-b border-[#cac4d0]">
              <span className="text-xs font-bold text-[#49454f] w-20">发布日期</span>
              <span className="text-sm text-[#1d1b20]">
                {wallpaper.date.slice(0, 4)}年{wallpaper.date.slice(4, 6)}月{wallpaper.date.slice(6, 8)}日
              </span>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-[#cac4d0]">
              <span className="text-xs font-bold text-[#49454f] w-20">分辨率</span>
              <span className="text-sm text-[#1d1b20]">UHD / 4K</span>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-[#cac4d0]">
              <span className="text-xs font-bold text-[#49454f] w-20">数据源</span>
              <span className="text-sm text-[#1d1b20]">Microsoft Bing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallpaperModal;
