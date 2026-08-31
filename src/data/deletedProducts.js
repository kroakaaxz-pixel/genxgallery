const DELETED_KEY = 'gxg_deleted_products';

function getDeletedIds() {
  try {
    const stored = localStorage.getItem(DELETED_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

export function markProductDeleted(id) {
  const ids = getDeletedIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(DELETED_KEY, JSON.stringify(ids));
  }
}

export function restoreProduct(id) {
  const ids = getDeletedIds().filter((i) => i !== id);
  localStorage.setItem(DELETED_KEY, JSON.stringify(ids));
}

export function isProductDeleted(id) {
  return getDeletedIds().includes(id);
}

export function getDeletedProductIds() {
  return getDeletedIds();
}
