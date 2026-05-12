import { useState, useEffect } from "react";

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  whatsappNumber: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Dr. João Paulo Silva-Neto",
  siteDescription: "Reabilitador Oral e Mentor de Dentistas",
  contactEmail: "contato@drjoaopaulo.com.br",
  whatsappNumber: "5584996455555",
};

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem("site-settings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  return settings;
}
