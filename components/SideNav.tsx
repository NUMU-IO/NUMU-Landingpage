import React from 'react';
import { NavItem } from '../types';

interface SideNavProps {
  items: NavItem[];
  activeId: string;
}

const SideNav: React.FC<SideNavProps> = ({ items, activeId }) => {
  const activeIndex = items.findIndex(item => item.id === activeId);
  // Calculate height percentage based on active index relative to total gaps (length - 1)
  const progressHeight = items.length > 1 ? (activeIndex / (items.length - 1)) * 100 : 0;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed ltr:right-8 rtl:left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center py-6 px-3 rounded-full bg-background-light/40 backdrop-blur-md border border-white/30 shadow-neu-floating">
      {/* 
          Container for the connecting lines.
          Positioned to start at the center of the first dot and end at the center of the last dot.
          Top/Bottom offset calculation: py-6 (1.5rem) + h-9/2 (1.125rem) = 2.625rem 
      */}
      <div className="absolute top-[2.625rem] bottom-[2.625rem] left-1/2 -translate-x-1/2 w-[2px] -z-10">
        {/* Background Guide Line */}
        <div className="absolute inset-0 bg-slate-300/50 rounded-full"></div>
        {/* Active Progress Line */}
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
                    className={`nav-link relative flex items-center justify-center w-9 h-9 group transition-all duration-300 cursor-pointer`}
                >
                    <span 
                        className={`absolute ltr:right-12 rtl:left-12 text-xs font-bold text-primary whitespace-nowrap px-3 py-1.5 bg-background-light/90 backdrop-blur rounded-lg shadow-neu-flat-sm border border-white/40 transition-all duration-300 ${
                            isActive ? 'opacity-100 ltr:translate-x-0 rtl:translate-x-0' : 'opacity-0 ltr:translate-x-[10px] rtl:-translate-x-[10px] group-hover:opacity-100 group-hover:translate-x-0'
                        }`}
                    >
                        {item.label}
                    </span>
                    
                    <div className={`nav-dot w-5 h-5 rounded-full bg-background-light transition-all duration-300 relative z-10 
                        ${isActive ? 'shadow-[inset_3px_3px_6px_0_rgba(163,177,198,0.7),inset_-3px_-3px_6px_0_rgba(255,255,255,0.8)]' : 'shadow-neu-flat-sm group-hover:scale-110'}`}
                    >
                         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-gradient transition-transform duration-300 ${isActive ? 'scale-100 shadow-[0_0_10px_#1e3a8a]' : 'scale-0'}`}></div>
                    </div>
                </a>
            );
        })}
      </div>
    </div>
  );
};

export default SideNav;