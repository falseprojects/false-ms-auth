declare namespace NodeJS {
  interface ProcessEnv {
    SERVER_PORT: number;
    JWT_SECRET: string;
  }
}
