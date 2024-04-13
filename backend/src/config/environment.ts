export default () => {
  return {
    SERVER_PORT: process.env.SERVER_PORT,

    DATABASE_TYPE: process.env.DATABASE_TYPE,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,

    // Redis Order config
    REDIS_BLOCK_HOST: process.env.REDIS_BLOCK_HOST,
    REDIS_BLOCK_PORT: Number(process.env.REDIS_BLOCK_PORT),
    REDIS_BLOCK_PASS: process.env.REDIS_BLOCK_PASS,
    REDIS_BLOCK_FAMILY: Number(process.env.REDIS_BLOCK_FAMILY),
    REDIS_BLOCK_DB: Number(process.env.REDIS_BLOCK_DB),

    // Web3 host
    MARKETPLACE_ADDRESS: process.env.MARKETPLACE_ADDRESS,
    CHAIN_ID: process.env.CHAIN_ID,

    // moralis
    MORALIS_API_KEY: process.env.MORALIS_API_KEY,
  };
};
