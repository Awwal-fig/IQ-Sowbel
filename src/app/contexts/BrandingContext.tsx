import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface BrandingSettings {
  logoUrl: string;
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  companyEmail: string;
  companyPhone: string;
  basePrice: number;
  parkName: string;
  parkAddress: string;
  parkLandmarks: string;
  parkOpeningTime: string;
}

const defaultBranding: BrandingSettings = {
  logoUrl: '/src/imports/image.png',
  companyName: 'IQ Sowbel',
  primaryColor: '#3b4a8c',
  secondaryColor: '#e8725c',
  accentColor: '#e8eaf2',
  companyEmail: 'info@iqsowbel.com',
  companyPhone: '+234 800 123 4567',
  basePrice: 30000,
  parkName: 'IQ Sowbel Main Terminal',
  parkAddress: 'Plot 45, Ahmadu Bello Way, Central Business District, Abuja',
  parkLandmarks: 'Opposite Central Bank of Nigeria Headquarters',
  parkOpeningTime: '5:00 AM',
};

interface BrandingContextType {
  branding: BrandingSettings;
  updateBranding: (settings: Partial<BrandingSettings>) => void;
  resetBranding: () => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<BrandingSettings>(() => {
    const stored = localStorage.getItem('brandingSettings');
    return stored ? JSON.parse(stored) : defaultBranding;
  });

  useEffect(() => {
    localStorage.setItem('brandingSettings', JSON.stringify(branding));

    // Apply CSS variables
    document.documentElement.style.setProperty('--color-primary', branding.primaryColor);
    document.documentElement.style.setProperty('--color-brand-coral', branding.secondaryColor);
    document.documentElement.style.setProperty('--color-accent', branding.accentColor);
  }, [branding]);

  const updateBranding = (settings: Partial<BrandingSettings>) => {
    setBranding(prev => ({ ...prev, ...settings }));
  };

  const resetBranding = () => {
    setBranding(defaultBranding);
  };

  return (
    <BrandingContext.Provider value={{ branding, updateBranding, resetBranding }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
}
