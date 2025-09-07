// utils/ssrTimeout.js
export function ssrTimeout(ms, label = 'ssr-timeout') {
  return new Promise((_, reject) => {
    const id = setTimeout(() => reject(new Error(`${label}:${ms}ms`)), ms);
  });
}
