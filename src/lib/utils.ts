import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Class name utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(date);
}

// String utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function camelCase(text: string): string {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

// Number utilities
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Array utilities
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Object utilities
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}

export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) result[key] = obj[key];
  });
  return result;
}

export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };
  
  for (const key in source) {
    const sourceValue = source[key];
    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
      result[key] = deepMerge(
        (result[key] as Record<string, unknown>) || {},
        sourceValue as Record<string, unknown>
      ) as T[Extract<keyof T, string>];
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as T[Extract<keyof T, string>];
    }
  }
  
  return result;
}

// URL utilities
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return window.location.origin;
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
}

export function buildUrl(path: string, params?: Record<string, string>): string {
  const url = new URL(path, getBaseUrl());
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  return url.toString();
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// File utilities
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

// Color utilities
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Storage utilities
export function safeParseJSON<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  
  try {
    const item = localStorage.getItem(key);
    return item ? safeParseJSON(item, fallback) : fallback;
  } catch {
    return fallback;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
}

// Debounce and throttle utilities
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

// Promise utilities
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function retry<T>(
  fn: () => Promise<T>,
  attempts: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) throw error;
    await sleep(delay);
    return retry(fn, attempts - 1, delay * 2);
  }
}