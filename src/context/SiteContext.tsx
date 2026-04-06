import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteData } from '../types';
import { INITIAL_SITE_DATA } from '../constants';
import imageCompression from 'browser-image-compression';

interface SiteContextType {
  data: SiteData;
  updateData: (newData: Partial<SiteData>) => void;
  addNotice: (notice: { title: string; content: string }) => void;
  deleteNotice: (id: string) => void;
  updateNotice: (id: string, notice: { title: string; content: string }) => void;
  compressAndSetImage: (file: File, callback: (base64: string) => void) => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData>(() => {
    const saved = localStorage.getItem('vista_site_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Data Migration: Convert old single image fields to arrays if needed
        if (parsed.floorPlans && Array.isArray(parsed.floorPlans)) {
          parsed.floorPlans = parsed.floorPlans.map((plan: any) => {
            if (!plan.images && plan.image) {
              return { ...plan, images: [plan.image] };
            }
            if (!plan.images) {
              return { ...plan, images: [] };
            }
            return plan;
          });
        }

        // Merge with initial data to ensure new fields are present
        return { 
          ...INITIAL_SITE_DATA, 
          ...parsed,
          // Ensure nested objects like quickMenu are also merged or at least present
          quickMenu: { ...INITIAL_SITE_DATA.quickMenu, ...(parsed.quickMenu || {}) }
        };
      } catch (e) {
        return INITIAL_SITE_DATA;
      }
    }
    return INITIAL_SITE_DATA;
  });

  useEffect(() => {
    try {
      localStorage.setItem('vista_site_data', JSON.stringify(data));
      // Update document title for SEO
      document.title = data.seoTitle;
      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', data.seoDescription);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'description';
        newMeta.content = data.seoDescription;
        document.head.appendChild(newMeta);
      }
    } catch (e) {
      console.error('Failed to save to localStorage (likely quota exceeded)', e);
    }
  }, [data]);

  const updateData = (newData: Partial<SiteData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const addNotice = (notice: { title: string; content: string }) => {
    const newNotice = {
      id: Date.now().toString(),
      title: notice.title,
      content: notice.content,
      date: new Date().toISOString().split('T')[0]
    };
    setData(prev => ({
      ...prev,
      notices: [newNotice, ...prev.notices]
    }));
  };

  const deleteNotice = (id: string) => {
    setData(prev => ({
      ...prev,
      notices: prev.notices.filter(n => n.id !== id)
    }));
  };

  const updateNotice = (id: string, notice: { title: string; content: string }) => {
    setData(prev => ({
      ...prev,
      notices: prev.notices.map(n => n.id === id ? { ...n, ...notice } : n)
    }));
  };

  const compressAndSetImage = async (file: File, callback: (base64: string) => void) => {
    const options = {
      maxSizeMB: 0.5, // 500KB limit for localStorage safety
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        callback(base64data);
      };
    } catch (error) {
      console.error('Image compression failed:', error);
    }
  };

  return (
    <SiteContext.Provider value={{ data, updateData, addNotice, deleteNotice, updateNotice, compressAndSetImage }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSite must be used within a SiteProvider');
  return context;
};
