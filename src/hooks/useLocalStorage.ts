"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validationFn?: (value: unknown) => value is T
): [T, Dispatch<SetStateAction<T>>] {
  const initialValueRef = useRef(initialValue);

  const readValue = useCallback(() => {
    if (typeof window === "undefined") return initialValueRef.current;

    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValueRef.current;

      const parsedItem: unknown = JSON.parse(item);
      if (validationFn && !validationFn(parsedItem)) {
        window.localStorage.removeItem(key);
        return initialValueRef.current;
      }

      return parsedItem as T;
    } catch {
      return initialValueRef.current;
    }
  }, [key, validationFn]);

  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (value) => {
      setStoredValue((previousValue) => {
        const nextValue =
          typeof value === "function"
            ? (value as (previousValue: T) => T)(previousValue)
            : value;

        try {
          window.localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {}

        return nextValue;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
