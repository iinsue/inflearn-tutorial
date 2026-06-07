import { CreateClientConfig } from "@/generated/openapi-client/client.gen";
import { getJwtToken } from "@/lib/auth-utils";

// Nest.js Backend를 바라볼 API URL을 작성
const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.BACKEND_API_URL
    : "http://localhost:3001";

// 형식에 맞춰야 하므로 오타 주의
export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseUrl: API_URL,
  async auth() {
    return getJwtToken();
  },
});
