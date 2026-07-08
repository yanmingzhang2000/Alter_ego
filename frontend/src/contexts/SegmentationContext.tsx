import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SegmentationRules {
  // 客户分层规则
  bigClientThreshold: number;  // 年度签约额阈值（元），大于等于此值为大客户
  silentDaysThreshold: number; // 沉默天数阈值，超过此天数无订单为沉默客户
  
  // 毛利率预警阈值
  profitMarginGood: number;    // 优秀毛利率（绿色）
  profitMarginWarning: number; // 预警毛利率（橙色），低于此值高于差值为预警
  profitMarginBad: number;     // 危险毛利率（红色），低于此值为危险
}

export interface StudioSegmentationRules {
  [studioId: string]: Partial<SegmentationRules>; // 工作室可以覆盖部分规则
}

interface SegmentationContextType {
  globalRules: SegmentationRules;
  studioRules: StudioSegmentationRules;
  getEffectiveRules: (studioId?: string) => SegmentationRules;
  updateGlobalRules: (rules: Partial<SegmentationRules>) => void;
  updateStudioRules: (studioId: string, rules: Partial<SegmentationRules>) => void;
  resetStudioRules: (studioId: string) => void;
}

const defaultGlobalRules: SegmentationRules = {
  bigClientThreshold: 1000000,  // 100万
  silentDaysThreshold: 90,      // 90天
  profitMarginGood: 25,         // 25%
  profitMarginWarning: 20,      // 20%
  profitMarginBad: 15,          // 15%
};

const SegmentationContext = createContext<SegmentationContextType | undefined>(undefined);

const STORAGE_KEY_GLOBAL = 'alter_ego_global_segmentation_rules';
const STORAGE_KEY_STUDIO = 'alter_ego_studio_segmentation_rules';

export const SegmentationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [globalRules, setGlobalRules] = useState<SegmentationRules>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_GLOBAL);
    if (saved) {
      try {
        return { ...defaultGlobalRules, ...JSON.parse(saved) };
      } catch {
        return defaultGlobalRules;
      }
    }
    return defaultGlobalRules;
  });

  const [studioRules, setStudioRules] = useState<StudioSegmentationRules>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STUDIO);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GLOBAL, JSON.stringify(globalRules));
  }, [globalRules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STUDIO, JSON.stringify(studioRules));
  }, [studioRules]);

  const getEffectiveRules = (studioId?: string): SegmentationRules => {
    if (!studioId || !studioRules[studioId]) {
      return globalRules;
    }
    return { ...globalRules, ...studioRules[studioId] };
  };

  const updateGlobalRules = (rules: Partial<SegmentationRules>) => {
    setGlobalRules(prev => ({ ...prev, ...rules }));
  };

  const updateStudioRules = (studioId: string, rules: Partial<SegmentationRules>) => {
    setStudioRules(prev => ({
      ...prev,
      [studioId]: { ...(prev[studioId] || {}), ...rules },
    }));
  };

  const resetStudioRules = (studioId: string) => {
    setStudioRules(prev => {
      const newRules = { ...prev };
      delete newRules[studioId];
      return newRules;
    });
  };

  return (
    <SegmentationContext.Provider
      value={{
        globalRules,
        studioRules,
        getEffectiveRules,
        updateGlobalRules,
        updateStudioRules,
        resetStudioRules,
      }}
    >
      {children}
    </SegmentationContext.Provider>
  );
};

export const useSegmentation = () => {
  const context = useContext(SegmentationContext);
  if (!context) {
    throw new Error('useSegmentation must be used within SegmentationProvider');
  }
  return context;
};
