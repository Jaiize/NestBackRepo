export interface ConfigEnv {
  secret: string;
  refsecret: string;
  salt: number;
  database: {
    port: number;
    username: string;
    password: string;
    name: string;
    host: string;
  };
}

const config = (): ConfigEnv => ({
  secret: process.env.SECRET_KEY!,
  refsecret: process.env.REF_SECRET_KEY!,
  salt: parseInt(process.env.SALT!),
  database: {
    name: process.env.DB_DATABASE!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USER!,
    password: process.env.DB_CODE!,
  },
});

export default config
