
import React, { useState, useEffect, useMemo } from 'react';
import TopAppBar from './components/TopAppBar';
import WallpaperCard from './components/WallpaperCard';
import WallpaperModal from './components/WallpaperModal';
import NavigationDrawer from './components/NavigationDrawer';
import { Wallpaper } from './types';
import { MOCK_WALLPAPERS } from './constants';
import { Calendar, History, TrendingUp, Sparkles, ImageOff, Layers } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: '全部', keywords: [] },
  { id: 'nature', label: '自然风景', keywords: ['山', '水', '林', '海', '湖', '峡湾', '国家公园', '风景', 'nature'] },
  { id: 'urban', label: '城市建筑', keywords: ['城', '塔', '建筑', '广场', '庙', '遗迹', 'urban', 'architecture'] },
  { id: 'animal', label: '萌宠动物', keywords: ['兽', '鸟', '鱼', '虫', '迁徙', '动物', 'animal'] },
  { id: 'space', label: '星空宇宙', keywords: ['星', '极光', '宇宙', '天体', 'space', 'astronomy'] }
];

const App: React.FC = () => {
  const [allWallpapers, setAllWallpapers] = useState<Wallpaper[]>([]);
  const [history, setHistory] = useState<Wallpaper[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // UI 交互状态
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedHistory = localStorage.getItem('wallpaper_history');
    const savedFavorites = localStorage.getItem('wallpaper_favorites');
    
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }
    if (savedFavorites) {
      try { setFavorites(JSON.parse(savedFavorites)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    const fetchWallpapers = async () => {
      setLoading(true);
      try {
        const fetchBatch = async (idx: number) => {
          const url = `https://www.bing.com/HPImageArchive.aspx?format=js&idx=${idx}&n=8&mkt=zh-CN`;
          const response = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(url));
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          return data.images || [];
        };

        const batches = [0, 8, 16, 24, 32, 40, 48];
        const results = await Promise.all(batches.map(idx => fetchBatch(idx).catch(() => [])));
        const combinedImages = results.flat();
        
        if (combinedImages.length === 0) throw new Error('No images found');

        const mapped = combinedImages.map((img: any) => {
          const baseUrl = img.url.startsWith('http') ? img.url : `https://www.bing.com${img.url}`;
          const hdUrl = img.urlbase 
            ? `https://www.bing.com${img.urlbase}_UHD.jpg` 
            : baseUrl.replace('1920x1080', 'UHD');

          return {
            id: img.hsh || Math.random().toString(36),
            url: baseUrl,
            hdUrl: hdUrl,
            title: img.title || '无标题',
            copyright: img.copyright || 'Bing',
            date: img.enddate || new Date().toISOString().split('T')[0].replace(/-/g, ''),
            description: img.copyright
          };
        });

        const uniqueMapped = Array.from(new Map(mapped.map(item => [item.id, item])).values());
        
        let finalData = uniqueMapped;
        if (finalData.length < 50) {
          const additionalNeeded = 50 - finalData.length;
          finalData = [...finalData, ...MOCK_WALLPAPERS.slice(0, additionalNeeded)];
        }

        setAllWallpapers(finalData);
      } catch (error) {
        setAllWallpapers(MOCK_WALLPAPERS as Wallpaper[]);
      } finally {
        setLoading(false);
      }
    };

    fetchWallpapers();
  }, []);

  const handleWallpaperClick = (wp: Wallpaper) => {
    setSelectedWallpaper(wp);
    setHistory(prev => {
      const filtered = prev.filter(item => item.id !== wp.id);
      const newHistory = [wp, ...filtered].slice(0, 50);
      localStorage.setItem('wallpaper_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(id);
      const newFavs = isFav ? prev.filter(fid => fid !== id) : [...prev, id];
      localStorage.setItem('wallpaper_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const displayedWallpapers = useMemo(() => {
    let source: Wallpaper[] = [];
    switch (activeTab) {
      case 'favorites':
        source = allWallpapers.filter(wp => favorites.includes(wp.id));
        break;
      case 'popular':
        source = [...allWallpapers].sort(() => 0.5 - Math.random()).slice(0, 50);
        break;
      case 'history':
        source = history;
        break;
      case 'category':
        source = allWallpapers;
        if (selectedCategory !== 'all') {
          const cat = CATEGORIES.find(c => c.id === selectedCategory);
          if (cat) {
            source = source.filter(wp => 
              cat.keywords.some(k => 
                wp.title.toLowerCase().includes(k) || 
                wp.copyright.toLowerCase().includes(k) ||
                (wp.description && wp.description.toLowerCase().includes(k))
              )
            );
          }
        }
        break;
      case 'daily':
      default:
        source = allWallpapers.slice(0, 50);
    }

    if (!searchQuery) return source;
    
    return source.filter(wp => 
      wp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      wp.copyright.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, allWallpapers, history, favorites, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#fdf7ff] pb-24 md:pb-8 flex flex-col overflow-x-hidden">
      <TopAppBar 
        onMenuClick={() => setIsDrawerOpen(true)} 
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />

      <NavigationDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        setActiveTab={(id) => {
          setActiveTab(id);
          setIsDrawerOpen(false);
        }}
      />

      {activeTab === 'daily' && !loading && !searchQuery && allWallpapers.length > 0 && (
        <section className="px-4 py-8 md:py-12 max-w-7xl mx-auto w-full">
          <div className="bg-[#eaddff] rounded-[32px] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-sm">
            <div className="flex-1 z-10">
              <div className="flex items-center gap-2 mb-4 bg-[#6750A4]/10 w-fit px-4 py-1 rounded-full text-[#6750A4] font-bold text-xs tracking-widest uppercase">
                <Sparkles size={14} /> 今日焦点
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#21005d] mb-4 leading-tight">
                视界在此无限延伸
              </h2>
              <p className="text-[#21005d]/80 text-lg mb-8 max-w-lg leading-relaxed">
                发现地球每个角落的绝美瞬间。为您已加载多达 50 张高清壁纸，支持 4K 下载与 AI 智能解读。
              </p>
              <button 
                className="px-8 py-3 bg-[#6750A4] text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
                onClick={() => handleWallpaperClick(allWallpapers[0])}
              >
                立即浏览
              </button>
            </div>
            
            <div className="flex-1 w-full flex justify-center z-10">
              <div 
                className="w-full max-w-sm aspect-video rounded-[24px] overflow-hidden shadow-2xl border-4 border-white rotate-2 cursor-pointer hover:rotate-0 transition-transform duration-500"
                onClick={() => handleWallpaperClick(allWallpapers[0])}
              >
                <img 
                  src={allWallpapers[0].url} 
                  alt="Feature" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/daily/800/450';
                  }}
                />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6750A4]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          </div>
        </section>
      )}

      <main className="px-4 md:px-8 max-w-7xl mx-auto w-full flex-grow mt-4">
        {searchQuery && (
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-medium text-[#1d1b20]">
              “{searchQuery}” 的搜索结果 ({displayedWallpapers.length})
            </h2>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-[#6750A4] text-sm font-bold hover:underline"
            >
              清除搜索
            </button>
          </div>
        )}

        <div className="flex flex-col mb-8">
          <div className="flex items-center justify-between overflow-x-auto gap-4 py-2 no-scrollbar">
            <div className="flex gap-2 p-1 bg-[#f3edf7] rounded-full">
              {[
                { id: 'daily', label: '全部作品', icon: Calendar },
                { id: 'popular', label: '随机发现', icon: TrendingUp },
                { id: 'history', label: '我的足迹', icon: History },
                { id: 'category', label: '探索分类', icon: Layers }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'bg-[#6750A4] text-white shadow-md' 
                      : 'text-[#49454f] hover:bg-[#6750A4]/5'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>
            {activeTab === 'history' && history.length > 0 && !searchQuery && (
              <button 
                onClick={() => {
                  setHistory([]);
                  localStorage.removeItem('wallpaper_history');
                }}
                className="text-sm text-[#ba1a1a] px-4 py-2 hover:bg-[#ba1a1a]/5 rounded-full transition-colors font-medium"
              >
                清空记录
              </button>
            )}
          </div>

          {/* 分类筛选二级菜单 */}
          {activeTab === 'category' && (
            <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar py-2 animate-in slide-in-from-top-2 duration-300">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#eaddff] border-[#6750A4] text-[#21005d]'
                      : 'border-[#cac4d0] text-[#49454f] hover:border-[#6750A4]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-pulse">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="bg-[#f3edf7] aspect-[16/10] rounded-[28px]" />
            ))}
          </div>
        ) : displayedWallpapers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-in fade-in duration-700">
            {displayedWallpapers.map((wp, idx) => (
              <WallpaperCard 
                key={`${activeTab}-${wp.id}-${idx}`} 
                wallpaper={wp} 
                onClick={handleWallpaperClick} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-[#49454f] opacity-60">
            <ImageOff size={64} strokeWidth={1} className="mb-4" />
            <p className="text-lg">
              {activeTab === 'favorites' ? '还没有收藏任何壁纸' : 
               activeTab === 'category' ? `暂无“${CATEGORIES.find(c => c.id === selectedCategory)?.label}”分类下的匹配内容` :
               '找不到匹配的壁纸'}
            </p>
            {(searchQuery || activeTab === 'favorites' || activeTab === 'category') && (
              <button 
                onClick={() => { setSearchQuery(''); setActiveTab('daily'); setSelectedCategory('all'); }} 
                className="mt-4 text-[#6750A4] font-bold"
              >
                去发现更多内容
              </button>
            )}
          </div>
        )}
      </main>

      <WallpaperModal 
        wallpaper={selectedWallpaper} 
        onClose={() => setSelectedWallpaper(null)} 
        isFavorite={selectedWallpaper ? favorites.includes(selectedWallpaper.id) : false}
        onToggleFavorite={selectedWallpaper ? () => toggleFavorite(selectedWallpaper.id) : () => {}}
      />
    </div>
  );
};

export default App;
