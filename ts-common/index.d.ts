// This work because:
// - '!!raw-loader!' prefixing a module tells webpack to overload a module loading with this module
// - any data that returns is returned as a string
declare module '!!raw-loader!*' {
  const contents: string;
  export = contents;
}
