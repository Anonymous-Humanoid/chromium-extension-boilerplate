// Setting default env vars
export const NODE_ENV = process.env.NODE_ENV ?? 'development';
export const PORT = process.env.PORT ?? '3000';
export const ASSET_PATH = process.env.ASSET_PATH ?? '/'; // Should start with a forward slash
