import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface SectionConfig {
  visible: boolean;
  order: number;
}

interface LandingConfig {
  sections: Record<string, SectionConfig>;
}

interface LandingConfigContextType {
  config: LandingConfig;
  isSectionVisible: (sectionId: string) => boolean;
  loading: boolean;
}

const DEFAULT_CONFIG: LandingConfig = {
  sections: {
    hero: { visible: true, order: 0 },
    preview: { visible: true, order: 1 },
    features: { visible: true, order: 2 },
    'import-showcase': { visible: true, order: 3 },
    'ai-showcase': { visible: true, order: 4 },
    'multichannel-showcase': { visible: true, order: 5 },
    integrations: { visible: true, order: 6 },
    testimonials: { visible: true, order: 7 },
    cta: { visible: true, order: 8 },
    footer: { visible: true, order: 9 },
  },
};

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:8021';
const CACHE_KEY = 'numu-landing-config';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const LandingConfigContext = createContext<LandingConfigContextType>({
  config: DEFAULT_CONFIG,
  isSectionVisible: () => true,
  loading: false,
});

export const LandingConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<LandingConfig>(() => {
    // Try to load from sessionStorage to avoid flicker
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          return data;
        }
      }
    } catch {
      // Ignore parse errors
    }
    return DEFAULT_CONFIG;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchConfig() {
      try {
        const res = await fetch(`${API_BASE}/api/v1/public/landing-config`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const data = json.data || json;

        if (!cancelled && data?.sections) {
          setConfig(data);
          // Cache in sessionStorage
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
          } catch {
            // Ignore storage errors
          }
        }
      } catch (err) {
        // Graceful fallback: show ALL sections when API is unavailable
        console.warn('[LandingConfig] Failed to fetch config, showing all sections:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchConfig();
    return () => { cancelled = true; };
  }, []);

  const isSectionVisible = (sectionId: string): boolean => {
    const section = config.sections[sectionId];
    // Default to visible if section not found in config
    return section ? section.visible : true;
  };

  return (
    <LandingConfigContext.Provider value={{ config, isSectionVisible, loading }}>
      {children}
    </LandingConfigContext.Provider>
  );
};

export const useLandingConfig = () => useContext(LandingConfigContext);
