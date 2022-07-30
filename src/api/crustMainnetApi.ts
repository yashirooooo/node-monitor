import { typesBundleForPolkadot } from '@crustio/type-definitions';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { logger } from '@polkadot/util';
import { chainAddr } from '../consts';
const l = logger('mainnet-api');

export const mainnetApi: ApiPromise = new ApiPromise({
    provider: new WsProvider(chainAddr || 'ws://localhost:9944'),
    typesBundle: typesBundleForPolkadot,
});

mainnetApi.on('connected', () => {
    l.log(`Mainnet API has been connected to the endpoint: ${chainAddr}`)
})

mainnetApi.on('disconnected', (): void => {
    l.error('Mainnet API has been disconnected from the endpoint')
    process.exit(0)
});