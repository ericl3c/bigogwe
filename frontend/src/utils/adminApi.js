const API_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_BASE = `${API_ORIGIN.replace(/\/$/, "")}/api`;

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}

export function assetUrl(path) {
  if (!path || path.startsWith("http")) return path;
  return `${API_ORIGIN.replace(/\/$/, "")}${path}`;
}

export function getStoredAuth() {
  const token = localStorage.getItem("adminToken");
  const user = localStorage.getItem("adminUser");
  if (!token || !user) return null;
  try {
    return { token, user: JSON.parse(user) };
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
}

export function saveAuth(token, user) {
  localStorage.setItem("adminToken", token);
  localStorage.setItem("adminUser", JSON.stringify(user));
}

export async function apiRequest(path, options = {}) {
  const auth = getStoredAuth();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (auth?.token) {
    headers.Authorization = `Bearer ${auth.token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export { API_BASE };
