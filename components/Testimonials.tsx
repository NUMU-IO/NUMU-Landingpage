import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Testimonials: React.FC = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: 'Fatma El-Sayed',
      loc: t('testimonials.t1.loc'),
      role: t('testimonials.t1.role'),
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAguaGHLE4dsiCBHhaxJBJOgSdrXySe7wlzAQHis1c8rIBPZBab0O39YAW4HlJkNe7n0a4_APzggAr1f55_f_3BdSVtFS8k4QPIH1wcjeitawb2dbrGtpxTI-kIUAG6Ty-sLybJWbI1rxJC_7_E9uqWzsAeQgqQXq7w_a5r0Hymc2hy01DPQWKhBbtujjJMXSX5ZDJ0xl7SAesbA8EuZ7gbQ4VtvhCEZfR--lOsmP6Gq88FZ7ad3qqJ17AzoDZLZDFnupjGdrTrNcM',
      text: t('testimonials.t1.text'),
      stars: 5
    },
    {
      name: 'Omar Al-Fayed',
      loc: t('testimonials.t2.loc'),
      role: t('testimonials.t2.role'),
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUP6eqqshb6uhu0GBHRbUihGW0r9kK3BXy-cSq1HShIvyR6RU59F2twQMgxA6OlIu8M7QRFOH3VDCZ0HpDJDRHfsA0REseg4yDlkEy__RJGKh2_z_-WdSYsYE3zAj9LbOPdVeQz_BIZw1Vs5VgLmqLQg0deWv14XhM8km4IiE-xFtSc5N9YQpE2AWLJrKDkE44N45w-4zHZG1g6vur6hlsHRpq1GK28-ZUj_qR1f_QK1QaLupw9T_5W7WfMfUxbklP-FtIAAHaP7A',
      text: t('testimonials.t2.text'),
      stars: 5
    },
    {
      name: 'Youssef Kamel',
      loc: t('testimonials.t3.loc'),
      role: t('testimonials.t3.role'),
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZLTM4W68pA2mcyJNgkHAEbqa8D8fPGeflE8zvCu5U-zTAd7vX_9O5EugJDlq2thUS-oTmBGwlOmJGNiCyMhTBXB1ZBVBivVy9JH6k-NFHWvBnDQZSrN2SRc_8PhqLXfsaMPcr7CJWzCppDdp9z6eBDz4vclQG5Ga1DSe0uBA0__sRAcXRbLAdvTKeWdhjzvd1pGfW2FJDtcl3qZvkIaXonWgwNzV3MDeVS-YZYVdcEA6WUosM2tfHEyJhxt4QVQxZskIeBR0V8yo',
      text: t('testimonials.t3.text'),
      stars: 5
    },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full px-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-text-main dark:text-white mb-6 sm:mb-8 md:mb-12 text-center">{t('testimonials.title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {testimonials.map((t, i) => (
          <div key={i} className="rounded-2xl sm:rounded-3xl shadow-neu-pressed p-5 sm:p-6 md:p-8 bg-background-light">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="size-10 sm:size-12 rounded-full shadow-neu-flat-sm bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${t.img}')` }}></div>
              <div>
                <p className="text-sm font-bold text-text-main dark:text-white">{t.name}</p>
                <div className="flex flex-col">
                  <p className="text-xs text-primary font-medium">{t.role}</p>
                  <p className="text-[10px] text-text-muted">{t.loc}</p>
                </div>
              </div>
            </div>
            <div className="flex text-primary mb-3">
              {[...Array(5)].map((_, starIdx) => (
                <span key={starIdx} className={`material-symbols-outlined text-sm ${starIdx < t.stars ? '' : 'text-text-muted/30'}`}>star</span>
              ))}
            </div>
            <p className="text-sm text-text-muted italic">{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;