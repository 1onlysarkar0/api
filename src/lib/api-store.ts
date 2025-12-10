"use client";

const STORAGE_KEY = "api_docs_settings";

interface ApiSettings {
  baseUrl: string;
}

export function getApiSettings(): ApiSettings {
  if (typeof window === "undefined") {
    return { baseUrl: "" };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse API settings:", e);
  }

  return { baseUrl: "" };
}

export function setApiSettings(settings: ApiSettings): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save API settings:", e);
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname.includes('replit') ? `https://${window.location.hostname.replace('-00-', '-01-').replace(':3001', '')}` : 'https://www.1onlysarkar.shop');