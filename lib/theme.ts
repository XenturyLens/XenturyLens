export type Theme = "light" | "dark";
export const THEME_KEY = "xl-theme";

export function resolveInitialTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === "light" || stored === "dark") return stored;
  return prefersDark ? "dark" : "light";
}

// Runs before hydration to set data-theme and avoid a flash.
export const THEME_SCRIPT = `(function(){try{
  var s=localStorage.getItem("${THEME_KEY}");
  var d=window.matchMedia("(prefers-color-scheme: dark)").matches;
  var t=(s==="light"||s==="dark")?s:(d?"dark":"light");
  document.documentElement.setAttribute("data-theme",t);
}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;
