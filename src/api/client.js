const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.detail || 'The request could not be completed.');
  return payload;
}

export const apiLogin = (email, password) => request('/auth/login/', { method: 'POST', body: JSON.stringify({ email, password }) });
export const apiRegister = (form) => request('/auth/register/', { method: 'POST', body: JSON.stringify({ full_name: form.name, email: form.email, phone: form.phone, password: form.password }) });
export const apiHealth = () => request('/health/');
