/**
 * Safely format a date string or timestamp.
 * Returns fallback string if date is missing or invalid.
 */
export function formatDate(dateVal, options = { month: 'short', day: 'numeric', year: 'numeric' }, fallback = '—') {
  if (!dateVal) return fallback;
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleDateString('en-US', options);
  } catch (e) {
    return fallback;
  }
}

/**
 * Safely format a date + time string or timestamp.
 */
export function formatDateTime(dateVal, fallback = '—') {
  if (!dateVal) return fallback;
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
      ' • ' + 
      d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return fallback;
  }
}

/**
 * Safely parse rules field which could be JSON array, newline-separated string, or array.
 */
export function parseRules(rulesData) {
  if (!rulesData) return ["All code must be original.", "Projects must align with the theme.", "A demonstration is required for submission."];
  if (Array.isArray(rulesData)) return rulesData;
  if (typeof rulesData === 'string') {
    try {
      const parsed = JSON.parse(rulesData);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // String was not JSON, split by newline
    }
    const split = rulesData.split('\n').map(r => r.trim()).filter(Boolean);
    return split.length > 0 ? split : [rulesData];
  }
  return ["All code must be original."];
}

/**
 * Safely parse prizes field which could be JSON array or array.
 */
export function parsePrizes(prizesData, fallbackPrizePool = 'TBA') {
  if (!prizesData) {
    return [
      { place: 'Grand Prize Pool', amount: fallbackPrizePool, icon: '🏆', color: '#fef3c7', iconColor: '#d97706', desc: 'Total prize distribution' }
    ];
  }
  if (Array.isArray(prizesData) && prizesData.length > 0) return prizesData;
  if (typeof prizesData === 'string') {
    try {
      const parsed = JSON.parse(prizesData);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      // Ignore parse error
    }
  }
  return [
    { place: 'Grand Prize Pool', amount: fallbackPrizePool, icon: '🏆', color: '#fef3c7', iconColor: '#d97706', desc: 'Total prize distribution' }
  ];
}
