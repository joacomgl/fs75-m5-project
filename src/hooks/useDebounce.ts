import { useState, useEffect } from "react";

/**
 * useDebounce — delays updating a value until `delay` ms have passed
 * without further changes. Useful for search inputs.
 *
 * @param value  The reactive value to debounce (typically a search string)
 * @param delay  Milliseconds to wait before propagating the new value
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    // Cleanup: clear the timer if value changes before delay expires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
