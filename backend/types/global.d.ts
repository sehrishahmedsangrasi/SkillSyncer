// Declare environment variables for TypeScript
declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
  }
}
