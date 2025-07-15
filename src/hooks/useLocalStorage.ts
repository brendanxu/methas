'use client';

import { useState, useEffect } from 'react';

// Production logging utilities
const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
};

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      logError(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      logError(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}