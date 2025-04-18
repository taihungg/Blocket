export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SUPABASE_ANON_KEY: string;
      SUPABASE_PROJECT_URL: string;
      ENV: "test" | "dev" | "prod";
      PORT: string, 
      GOOGLE_CLIENT_ID: string,
      GOOGLE_REDIRECT_URI: string,
      SUI_PROVER_ENDPOINT: string,
    }
  }
}