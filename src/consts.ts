// Load env

// eslint-disable-next-line node/no-extraneous-require
require('dotenv').config();

export const chainAddr = process.env.CHAIN_ADDR as string;
export const ddurl = process.env.DDURL as string;
export const offlineThreshold = Number(process.env.OFFLINETHRESHOLD as string);