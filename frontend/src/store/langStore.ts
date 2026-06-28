import { create } from 'zustand';
import i18n from '../i18n/i18n';

interface LangState {
  language: 'en' | 'fr';
  setLanguage: (lang: 'en' | 'fr') => void;
}

export const useLangStore = create<LangState>((set) => ({
  language: (localStorage.getItem('i18nextLng') || 'en') as 'en' | 'fr',

  setLanguage: (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    set({ language: lang });
  },
}));
