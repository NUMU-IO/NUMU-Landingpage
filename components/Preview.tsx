import React, { useState } from 'react';

const Preview: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(4);
  const chartData = [
    { day: 'MON', height: '40%' },
    { day: 'TUE', height: '60%' },
    { day: 'WED', height: '30%' },
    { day: 'THU', height: '80%' },
    { day: 'FRI', height: '65%' },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col items-center justify-center h-full px-4">
      <div className="text-center mb-8 lg:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white mb-2">Command Center</h2>
        <p className="text-text-muted max-w-xl mx-auto">Everything you need to run your Egyptian empire in one place.</p>
      </div>
      <div className="relative w-full max-w-4xl lg:aspect-video lg:h-[500px] flex items-center justify-center">
        <div className="relative w-full h-full bg-background-light dark:bg-background-dark rounded-3xl shadow-neu-floating p-4 md:p-8 transform transition-transform duration-500 hover:scale-[1.01] flex flex-col min-h-[500px] lg:min-h-0">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <div className="flex gap-2">
              <div className="size-3 rounded-full bg-red-400 shadow-neu-pressed-sm"></div>
              <div className="size-3 rounded-full bg-yellow-400 shadow-neu-pressed-sm"></div>
              <div className="size-3 rounded-full bg-green-400 shadow-neu-pressed-sm"></div>
            </div>
            <div className="h-2 w-24 rounded-full shadow-neu-pressed"></div>
          </div>
          <div className="flex-grow flex flex-col md:flex-row gap-6 h-full overflow-hidden">
            <div className="flex-grow flex flex-col gap-4 w-full md:w-2/3">
              <div className="bg-background-light dark:bg-background-dark rounded-2xl shadow-neu-pressed p-6 flex-grow flex flex-col justify-end">
                <div className="flex justify-between items-end h-full gap-3 pb-2" onMouseLeave={() => setActiveIndex(4)}>
                  {chartData.map((item, index) => (
                    <div
                      key={item.day}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`w-full rounded-t-lg relative group cursor-pointer transition-all duration-300 origin-bottom ${
                        activeIndex === index
                          ? 'bg-brand-gradient shadow-[0_0_15px_rgba(30,58,138,0.5)] scale-y-105'
                          : 'bg-primary/20 hover:bg-primary/30'
                      }`}
                      style={{ height: item.height }}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs font-bold text-text-muted border-t border-gray-200/50 pt-2">
                  {chartData.map((item, index) => (
                    <span 
                      key={item.day} 
                      className={`transition-colors duration-300 ${activeIndex === index ? 'text-primary' : ''}`}
                    >
                      {item.day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              <div className="bg-background-light dark:bg-background-dark rounded-xl shadow-neu-flat-sm p-4 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
                  <span className="text-xs font-bold text-text-muted">Revenue</span>
                </div>
                <p className="text-xl font-black text-text-main dark:text-white">EGP 42,405</p>
              </div>
              <div className="bg-background-light dark:bg-background-dark rounded-xl shadow-neu-flat-sm p-4 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-green-500 text-sm">shopping_bag</span>
                  <span className="text-xs font-bold text-text-muted">Orders</span>
                </div>
                <p className="text-xl font-black text-text-main dark:text-white">845</p>
              </div>
              <div className="bg-background-light dark:bg-background-dark rounded-xl shadow-neu-flat-sm p-4 flex-1 flex flex-col justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                 <div className="flex items-center gap-2 mb-2">
                   <span className="material-symbols-outlined text-orange-500 text-sm group-hover:scale-110 transition-transform duration-300 rtl:-scale-x-100">local_shipping</span>
                   <span className="text-xs font-bold text-text-muted">Pending Shipments</span>
                 </div>
                 <p className="text-xl font-black text-text-main dark:text-white">12</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-6 top-20 bg-background-light dark:bg-background-dark p-4 rounded-xl shadow-neu-floating animate-bounce hidden md:block" style={{ animationDuration: '3s' }}>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-cover bg-center shadow-neu-pressed" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuChrw_ty--tfe2xRRDTWWkWxzY87nwwvfnja0ne1Gh8vbBMRdPrmuv294dOU4GrRSBn3RKBci8niBAY3WWFwvOgCGsjXzL0OFses_7W27KBJizfqcvQ9yUdWktPG3Z6d78ugAaLFnh5k7YwV9AayU_b1JAjUE7wdk726Ma7XhfUTJFOHmQVkB83czOBuHM2MxH29eAu0yXlp1VFaPvPADrX1t05iea77xjsOULAjP_KAoj2YR3fOF4Ks4-d5NUYEkYvHiO4E-gltak')" }}></div>
            <div>
              <p className="text-xs font-bold text-text-main">New Order!</p>
              <p className="text-[10px] text-text-muted">Just now • Cairo, EG</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;