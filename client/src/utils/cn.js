/** Join class names; skips falsy values. */
export default function cn(...parts) {
  return parts.flat().filter(Boolean).join(' ')
}
