import React from 'react';
import { NavItem } from '../types';

interface SideNavProps {
  items: NavItem[];
  activeId: string;
}

/**
 * Section progress rail — flat editorial pill, no neumorphic.
 * Cream/paper ground since hero is now cream. Navy progress on bone track.
 * Active dot: navy with terracotta inner dot.
 */
const SideNav: React.FC<SideNavProps> = ({ items, activeId }) => {
  const activeIndex = items.findIndex((item) => item.id === activeId);
  const progressHeight =
    items.length > 1 ? (activeIndex / (items.length - 1)) * 100 : 0;

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed ltr:right-8 rtl:left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center py-6 px-3 rounded-[4px] bg-paper/90 backdrop-blur-md border border-ink/10 shadow-card">
      {/* Track + progress bar (navy on bone) */}
      <div className="absolute top-[2.625rem] bottom-[2.625rem] left-1/2 -translate-x-1/2 w-[2px] -z-10">
        <div className="absolute inset-0 bg-bone rounded-full" />
        <div
          className="absolute top-0 left-0 w-full bg-navy rounded-full transition-all duration-500 ease-numu"
          style={{ height: `${progressHeight}%` }}
        />
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
              className="nav-link relative flex items-center justify-center w-8 h-8 group transition-all duration-200 ease-numu cursor-pointer"
            >
              {/* Label pill — mono eyebrow on paper, hairline border */}
              <span
                className={`absolute ltr:right-11 rtl:left-11 whitespace-nowrap px-2.5 py-1 rounded-[4px] bg-paper border border-ink/10 shadow-card transition-all duration-200 ease-numu font-mono text-[10px] uppercase tracking-[0.18em] font-semibold ${
                  isActive
                    ? 'text-navy opacity-100 translate-x-0'
                    : 'text-ink-soft opacity-0 ltr:translate-x-[10px] rtl:-translate-x-[10px] group-hover:opacity-100 group-hover:translate-x-0'
                }`}
              >
                {item.label}
              </span>

              {/* Outer dot — hairline ring on inactive, filled navy on active */}
              <div
                className={`w-4 h-4 rounded-full transition-all duration-200 ease-numu relative z-10 border ${
                  isActive
                    ? 'bg-navy border-navy'
                    : 'bg-cream border-ink/20 group-hover:border-navy/40 group-hover:scale-110'
                }`}
              >
                {/* Inner dot — terracotta core on active (brand-kit accent) */}
                <span
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-transform duration-200 ease-numu ${
                    isActive ? 'scale-100 bg-terracotta' : 'scale-0 bg-navy'
                  }`}
                />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SideNav;
