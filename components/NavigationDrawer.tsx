
import React from 'react';
import { Calendar, History, TrendingUp, Info, Github, Heart, Settings, X } from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'daily', label: '每日精选', icon: Calendar },
    { id: 'popular', label: '热门发现', icon: TrendingUp },
    { id: 'history', label: '我的足迹', icon: History },
  ];

  const secondaryItems = [
    { id: 'favorites', label: '收藏夹', icon: Heart },
    { id: 'settings', label: '个性化设置', icon: Settings },
  ];

  return (
    <>
      {/* 遮罩层 */}
      <div 
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* 抽屉容器 */}
      <aside className={`fixed top-0 left-0 bottom-0 w-[300px] bg-[#fdf7ff] z-[70] shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:rounded-r-[28px]`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-bold tracking-[.1em] text-[#6750A4] uppercase px-4">Lumina</h2>
            <button onClick={onClose} className="p-2 hover:bg-[#e7e0eb] rounded-full md:hidden">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-1 mb-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-4 px-4 h-14 rounded-full transition-all duration-200 group ${
                  activeTab === item.id 
                    ? 'bg-[#eaddff] text-[#21005d]' 
                    : 'text-[#49454f] hover:bg-[#49454f]/5'
                }`}
              >
                <div className={`${activeTab === item.id ? 'text-[#21005d]' : 'text-[#49454f]'}`}>
                  <item.icon size={24} />
                </div>
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-[#e7e0eb] my-4"></div>
          
          <div className="flex flex-col gap-1 mb-auto">
            <h3 className="px-4 py-3 text-xs font-bold text-[#49454f] uppercase tracking-wider">库管理</h3>
            {secondaryItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'favorites') setActiveTab('favorites');
                  else onClose();
                }}
                className={`flex items-center gap-4 px-4 h-14 rounded-full transition-all duration-200 group ${
                  activeTab === item.id 
                    ? 'bg-[#eaddff] text-[#21005d]' 
                    : 'text-[#49454f] hover:bg-[#49454f]/5'
                }`}
              >
                <item.icon size={24} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4 mt-8 pt-4 border-t border-[#e7e0eb]">
            <div className="flex gap-4 px-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-[#49454f] hover:text-[#6750A4] transition-colors"><Github size={20} /></a>
              <a href="#" className="text-[#49454f] hover:text-[#6750A4] transition-colors"><Info size={20} /></a>
            </div>
            <p className="px-4 text-[11px] text-[#49454f]/60 leading-relaxed">
              &copy; 2024 Lumina Bing Gallery<br/>
              Made with Material Design 3
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default NavigationDrawer;
