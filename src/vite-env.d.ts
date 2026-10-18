/// <reference types="vite/client" />

// Vanta ships untyped UMD builds; each effect is a factory returning an instance with destroy()
declare module 'vanta/dist/*' {
  const effect: (options: Record<string, unknown>) => { destroy: () => void };
  export default effect;
}
