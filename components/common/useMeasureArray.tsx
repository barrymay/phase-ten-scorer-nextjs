import useMeasure, { IRect, RefContainer } from './useMeasure';

export default function useMeasureArray<T extends HTMLElement>(
  length: number,
): {
  refs: Array<RefContainer<T>>;
  results: Array<IRect>;
} {
  let refs: Array<RefContainer<T>> = [];
  let results: Array<IRect> = [];
  for (let i = 0; i < length; i++) {
    const [ref, result] = useMeasure<T>();
    refs[i] = ref;
    results[i] = result;
  }

  return {
    refs,
    results,
  };
}
