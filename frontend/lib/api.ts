"use server";

import { getJwtToken } from "./auth-utils";

const API_URL = process.env.BACKEND_API_URL || "http://localhost:3001";

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  } as Record<string, string>;

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    cache: "no-store",
  };

  if (options.body && typeof options.body !== "string") {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  // 값이 비어있거나 JSON이 아닐 경우
  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  } else {
    return response.text() as Promise<T>;
  }
}

export async function getUserTest() {
  const token = await getJwtToken();

  return fetchApi<string>("/user-test", {}, token);
}
