import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  BrandSettings, 
  Hall, 
  MenuItem, 
  MenuPackage, 
  DecorationOption, 
  OptionalService, 
  PricingRules,
  ShowcaseSpace 
} from '../types';
import { 
  DEFAULT_BRAND_SETTINGS, 
  DEFAULT_HALLS, 
  DEFAULT_MENU_PACKAGES, 
  DEFAULT_MENU_ITEMS, 
  DEFAULT_DECORATIONS, 
  DEFAULT_SERVICES, 
  DEFAULT_PRICING_RULES 
} from '../config/defaultSettings';
import { 
  getBrandSettings, 
  saveBrandSettings, 
  getHalls, 
  getMenuPackages, 
  getMenuItems, 
  getDecorations, 
  getOptionalServices, 
  getPricingRules, 
  savePricingRules,
  deleteHall as apiDeleteHall,
  deleteMenuPackage as apiDeleteMenuPackage,
  deleteMenuItem as apiDeleteMenuItem,
  deleteDecoration as apiDeleteDecoration,
  deleteOptionalService as apiDeleteOptionalService,
  resetToDefaultData as apiResetToDefaultData
} from '../services/firebaseService';

interface BrandContextType {
  brand: BrandSettings;
  halls: Hall[];
  menuPackages: MenuPackage[];
  menuItems: MenuItem[];
  decorations: DecorationOption[];
  optionalServices: OptionalService[];
  pricingRules: PricingRules;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  updateBrand: (updated: BrandSettings) => Promise<void>;
  updateShowcaseSpaces: (spaces: ShowcaseSpace[]) => Promise<void>;
  updatePricingRules: (rules: PricingRules) => Promise<void>;
  deleteHall: (id: string) => Promise<void>;
  deleteMenuPackage: (id: string) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  deleteDecoration: (id: string) => Promise<void>;
  deleteOptionalService: (id: string) => Promise<void>;
  resetAllData: () => Promise<void>;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [brand, setBrand] = useState<BrandSettings>(DEFAULT_BRAND_SETTINGS);
  const [halls, setHalls] = useState<Hall[]>(DEFAULT_HALLS);
  const [menuPackages, setMenuPackages] = useState<MenuPackage[]>(DEFAULT_MENU_PACKAGES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);
  const [decorations, setDecorations] = useState<DecorationOption[]>(DEFAULT_DECORATIONS);
  const [optionalServices, setOptionalServices] = useState<OptionalService[]>(DEFAULT_SERVICES);
  const [pricingRules, setPricingRules] = useState<PricingRules>(DEFAULT_PRICING_RULES);
  const [isLoading, setIsLoading] = useState(true);

  const loadAll = async () => {
    try {
      setIsLoading(true);
      const [b, h, p, m, d, s, r] = await Promise.all([
        getBrandSettings(),
        getHalls(),
        getMenuPackages(),
        getMenuItems(),
        getDecorations(),
        getOptionalServices(),
        getPricingRules(),
      ]);
      setBrand(b);
      setHalls(h);
      setMenuPackages(p);
      setMenuItems(m);
      setDecorations(d);
      setOptionalServices(s);
      setPricingRules(r);

      // Dynamically apply custom primary color token
      if (b.primaryColor) {
        document.documentElement.style.setProperty('--color-gold', b.primaryColor);
      }
    } catch (e) {
      console.error('Failed to load marquee configuration:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleUpdateBrand = async (updated: BrandSettings) => {
    setBrand(updated);
    if (updated.primaryColor) {
      document.documentElement.style.setProperty('--color-gold', updated.primaryColor);
    }
    await saveBrandSettings(updated);
  };

  const handleUpdateShowcaseSpaces = async (spaces: ShowcaseSpace[]) => {
    const updatedBrand: BrandSettings = {
      ...brand,
      showcaseSpaces: spaces,
    };
    setBrand(updatedBrand);
    await saveBrandSettings(updatedBrand);
  };

  const handleUpdatePricingRules = async (rules: PricingRules) => {
    setPricingRules(rules);
    await savePricingRules(rules);
  };

  const handleDeleteHall = async (id: string) => {
    await apiDeleteHall(id);
    await loadAll();
  };

  const handleDeleteMenuPackage = async (id: string) => {
    await apiDeleteMenuPackage(id);
    await loadAll();
  };

  const handleDeleteMenuItem = async (id: string) => {
    await apiDeleteMenuItem(id);
    await loadAll();
  };

  const handleDeleteDecoration = async (id: string) => {
    await apiDeleteDecoration(id);
    await loadAll();
  };

  const handleDeleteOptionalService = async (id: string) => {
    await apiDeleteOptionalService(id);
    await loadAll();
  };

  const handleResetAllData = async () => {
    await apiResetToDefaultData();
    await loadAll();
  };

  return (
    <BrandContext.Provider
      value={{
        brand,
        halls,
        menuPackages,
        menuItems,
        decorations,
        optionalServices,
        pricingRules,
        isLoading,
        refreshData: loadAll,
        updateBrand: handleUpdateBrand,
        updateShowcaseSpaces: handleUpdateShowcaseSpaces,
        updatePricingRules: handleUpdatePricingRules,
        deleteHall: handleDeleteHall,
        deleteMenuPackage: handleDeleteMenuPackage,
        deleteMenuItem: handleDeleteMenuItem,
        deleteDecoration: handleDeleteDecoration,
        deleteOptionalService: handleDeleteOptionalService,
        resetAllData: handleResetAllData,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = (): BrandContextType => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};
