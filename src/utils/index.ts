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