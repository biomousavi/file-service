declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    MINIO_PORT: number;
    SERVER_PORT: number;
    MINIO_CONSOLE_PORT: number;
    MINIO_ROOT_USER: string;
    MINIO_ROOT_PASSWORD: string;
    SERVER_ENDPOINT: string;
  }
}
