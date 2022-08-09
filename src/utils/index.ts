import BN from 'bn.js';

const CRU_UNIT = new BN('1000000000');
export const parseObj = (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
};

export function sleep(time: number) {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

export const unitToNumber = (unit: BN) => {
    if (unit.isZero()) return 0;
    return unit.div(CRU_UNIT).toNumber() / 1000.0;
}