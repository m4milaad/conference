const STORAGE_KEY = "2ai_admin_token";

export function getAdminToken() {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token) {
  sessionStorage.setItem(STORAGE_KEY, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(STORAGE_KEY);
}
