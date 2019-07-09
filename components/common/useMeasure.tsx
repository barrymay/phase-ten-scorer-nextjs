import { useState, useEffect, useRef, RefObject } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export interface IRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export default function useMeasure<T extends HTMLElement>(): [
  {
    ref: RefObject<T>;
  },
  {
    left: number;
    top: number;
    width: number;
    height: number;
  }
] {
  const ref = useRef<T>(null);
  const [bounds, set] = useState<IRect>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const [ro] = useState(
    () =>
      new ResizeObserver(([entry]) => {
        set(entry.contentRect);
      })
  );

  useEffect(() => {
    if (ref.current) {
      set(ref.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    if (ref.current) {
      ro.observe(ref.current);
    }
    return () => ro.disconnect();
  }, [ro]);
  return [{ ref }, bounds];
}
