/**
 * Inline in <head> before the bundle so the first paint already has the right
 * theme (no white flash). Storage may throw (blocked cookies, private mode):
 * the system preference must still apply.
 */
export const THEME_INIT_SCRIPT =
  "try{var t=null;try{t=localStorage.getItem('theme')}catch(e){}var d=t?t==='dark':window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',!!d);}catch(e){}";
