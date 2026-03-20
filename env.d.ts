/* eslint-disable */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_HOST?: string;
      POSTGRES_PORT?: string;
      POSTGRES_USERNAME?: string;
      POSTGRES_PASSWORD?: string;
      POSTGRES_DATABASE?: string;
      REDIS_HOST?: string;
      REDIS_PORT?: string;
      SMTP_HOST?: string;
      SMTP_PORT?: string;
      SMTP_USER?: string;
      SMTP_FROM?: string;
      SMTP_PASS?: string;
      JWT_SECRET_KEY?: string;
      IS_DEV?: boolean;
    }
  }
}

export {};
