import React, { useState, useEffect } from 'react';
import { NavItem } from '../types';

interface SideNavProps {
  items: NavItem[];
  activeId: string;
}

const SideNav: React.FC<SideNavProps> = ({ items, activeId }) => {
  const [isOnDark, setIsOnDark] = useState(true);
  const activeIndex = items.findIndex(item => item.id === activeId);
  const progressHeight = items.length > 1 ? (activeIndex / (items.length - 1)) * 100 : 0;

  // Detect if we're still in the hero (dark) section
  useEffect(() => {
    setIsOnDark(activeId === 'hero');
  }, [activeId]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`fixed ltr:right-8 rtl:left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center py-6 px-3 rounded-full backdrop-blur-md transition-all duration-500 ${
      isOnDark
        ? 'bg-white/[0.05] border border-white/[0.08]'
        : 'bg-background-light/40 border border-white/30 shadow-neu-floating'
    }`}>
      <div className="absolute top-[2.625rem] bottom-[2.625rem] left-1/2 -translate-x-1/2 w-[2px] -z-10">
        <div className={`absolute inset-0 rounded-full ${isOnDark ? 'bg-white/10' : 'bg-slate-300/50'}`}></div>
        <div
          className="absolute top-0 left-0 w-full bg-brand-gradient rounded-full transition-all duration-500 ease-out"
          style={{ height: `${progressHeight}%` }}
        ></div>
      </div>

      <div className="flex flex-col gap-6 relative">
        {items.map((item) => {
            const isActive = item.id === activeId;
            return (
                <a
                    key={item.id}
                    aria-label={`Go to ${item.label}`}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className="nav-link relative flex items-center justify-center w-9 h-9 group transition-all duration-300 cursor-pointer"
                >
                    <span
                        className={`absolute ltr:right-12 rtl:left-12 text-xs font-bold whitespace-nowrap px-3 py-1.5 backdrop-blur rounded-lg transition-all duration-300 ${
                          isOnDark
                            ? `text-white border border-white/10 bg-white/10 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 ltr:translate-x-[10px] rtl:-translate-x-[10px] group-hover:opacity-100 group-hover:translate-x-0'}`
                            : `text-primary bg-background-light/90 shadow-neu-flat-sm border border-white/40 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 ltr:translate-x-[10px] rtl:-translate-x-[10px] group-hover:opacity-100 group-hover:translate-x-0'}`
                        }`}
                    >
                        {item.label}
                    </span>

                    <div className={`nav-dot w-5 h-5 rounded-full transition-all duration-300 relative z-10 ${
                      isOnDark
                        ? (isActive ? 'bg-white/20 shadow-[inset_0_0_4px_rgba(255,255,255,0.2)]' : 'bg-white/10 group-hover:bg-white/20 group-hover:scale-110')
                        : (isActive ? 'bg-background-light shadow-[inset_3px_3px_6px_0_rgba(163,177,198,0.7),inset_-3px_-3px_6px_0_rgba(255,255,255,0.8)]' : 'bg-background-light shadow-neu-flat-sm group-hover:scale-110')
                    }`}>
                         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-transform duration-300 ${
                           isActive
                             ? (isOnDark ? 'scale-100 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'scale-100 bg-brand-gradient shadow-[0_0_10px_#1e3a8a]')
                             : 'scale-0 bg-brand-gradient'
                         }`}></div>
                    </div>
                </a>
            );
        })}
      </div>
    </div>
  );
};

export default SideNav;
