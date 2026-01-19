import { useState, useCallback, useEffect } from 'react';
import { SurveyRecord } from '../types/index';

/**
 * 데이터 필터링 훅
 */
export function useDataFilter(initialData: SurveyRecord[]) {
  const [filteredData, setFilteredData] = useState(initialData);
  const [filterOrg, setFilterOrg] = useState<string>('전체');

  useEffect(() => {
    if (filterOrg === '전체') {
      setFilteredData(initialData);
    } else {
      const filtered = initialData.filter(
        (record) => record.소속1 === filterOrg
      );
      setFilteredData(filtered);
    }
  }, [filterOrg, initialData]);

  const updateFilter = useCallback((org: string) => {
    setFilterOrg(org);
  }, []);

  return { filteredData, filterOrg, updateFilter };
}

/**
 * 로컬 스토리지 훅
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  };

  return [storedValue, setValue] as const;
}

/**
 * 디바운스 훅
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 이전 값 추적 훅
 */
export function usePrevious<T>(value: T): T | undefined {
  const [prev, setPrev] = useState<T | undefined>();

  useEffect(() => {
    setPrev(value);
  }, [value]);

  return prev;
}

/**
 * 마운트 상태 확인 훅
 */
export function useMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}

/**
 * 비동기 데이터 패치 훅
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Unknown error'));
      setStatus('error');
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
}

/**
 * 클릭 아웃사이드 감지 훅
 */
export function useClickOutside(ref: React.RefObject<HTMLDivElement>) {
  const [isClickInside, setIsClickInside] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        setIsClickInside(false);
      } else {
        setIsClickInside(true);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref]);

  return isClickInside;
}

/**
 * 윈도우 크기 감지 훅
 */
export function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

/**
 * 페이지 제목 변경 훅
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | 조직문화 진단 대시보드`;

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
