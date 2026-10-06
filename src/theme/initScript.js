/** Inline in <head> before the bundle so the first paint already has the right theme (no white flash). */
export const THEME_INIT_SCRIPT =
  "try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',!!d);}catch(e){}";
