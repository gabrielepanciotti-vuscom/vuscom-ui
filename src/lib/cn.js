import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Joins class names (clsx syntax) and resolves conflicting Tailwind utilities. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
