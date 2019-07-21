import { RefObject, useEffect, useRef, useState, useLayoutEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export interface IRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface RefContainer<T> {
  ref: RefObject<T>;
}

export default function useMeasure<T extends HTMLElement>(): [
  RefContainer<T>,
  IRect,
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
      }),
  );

  useLayoutEffect(() => {
    if (ref.current) {
      set(ref.current.getBoundingClientRect());
    }
  }, []);

  useLayoutEffect(() => {
    if (ref.current) {
      ro.observe(ref.current);
    }
    return () => {
      ro.disconnect();
    };
  }, [ro]);
  return [{ ref }, bounds];
}
