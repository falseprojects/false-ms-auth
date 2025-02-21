declare namespace NodeJS {
  interface ProcessEnv {
    SERVER_PORT: number;
    JWT_SECRET: string;
    USERS_API_PATH: string;
    REDIS_URL: string;
    EMAIL: string;
    EMAIL_PASSWORD: string;
    FRONTEND_PATH_VERIFY_EMAIL: string;
    FRONTEND_PATH_CHANGE_PASSWORD: string;
  }
}
