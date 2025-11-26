// src/api/auth.ts
const API_BASE = "http://192.168.0.100:5000"; // CHANGE -> your machine IP or localhost depending on emulator/device

async function handleRes(res: Response) {
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return { ok: res.ok, data: json };
  } catch {
    return { ok: res.ok, data: null, text };
  }
}

export async function registerApi(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return handleRes(res);
}

export async function loginEmailPasswordApi(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login-email-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleRes(res);
}

export async function setupPinApi(userId: string, pin: string) {
  const res = await fetch(`${API_BASE}/api/auth/setup-pin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, pin }),
  });
  return handleRes(res);
}

export async function loginPinApi(email: string, pin: string) {
  const res = await fetch(`${API_BASE}/api/auth/login-pin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, pin }),
  });
  return handleRes(res);
}

export async function fetchProfileApi(token: string) {
  const res = await fetch(`${API_BASE}/api/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleRes(res);
}
