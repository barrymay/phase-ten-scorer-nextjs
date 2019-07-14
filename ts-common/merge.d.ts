/** For solving generic types */
declare type Solve<T> = T;

/**  Merge B properties into A */
export declare type Merge<A, B> = Solve<
  {
    [K in keyof A]: K extends keyof B ? B[K] : A[K];
  } &
    B
>;
