import { mainnetApi } from "./api/crustMainnetApi"
import { parseObj, sleep } from "./utils";
import { logger } from '@polkadot/util';
import _ from 'lodash';
import { ddurl, offlineThreshold } from "./consts";
import { ApiPromise } from "@polkadot/api";

const l = logger('main');

let currentEra = 1414;

const axios = require('axios');

const maybeDoDingdingcall = async (_api: ApiPromise, activeEra: number) => {
    const validatorCount = parseObj(await _api.query.staking.validatorCount());

    const erasRewardPoints = parseObj(await _api.query.staking.erasRewardPoints(activeEra));
    console.log('erasRewardPoints: ', erasRewardPoints.individual)
    const result = Object.entries(erasRewardPoints.individual).map(e => e[1]);
    const offlineCount = validatorCount - result.length;
    const offlineRate = _.divide(offlineCount, validatorCount);
    console.log('result: ', result.length)
    // const haha = _.countBy(result, e => e == 140)
    console.log('haha: ', offlineRate)
    console.log('haha > offlineThreshold: ', offlineRate > offlineThreshold);
    if (offlineRate > offlineThreshold) {
        // 掉线率大于掉线阈值时发送钉钉警报
        const data = JSON.stringify({ "msgtype": "text", "text": { "content": `offline count: ${offlineCount}, validator count: ${validatorCount}, validator offlineRate: ${offlineRate}` }, "at": { "atMobiles": "['validator]", "isAtAll": false } });
        const config = {
            method: 'post',
            url: ddurl,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config).then(function (response: { data: any; }) {
            console.log(JSON.stringify(response.data));
        }).catch(function (error: any) {
            console.log(error);
        });
    } else {
        let nowTime = new Date(Date.parse(new Date().toString()));
        const hour = nowTime.getHours();
        const minitus = nowTime.getMinutes();
        console.log("hour", hour)
        if(hour < 12 && hour >= 11 && minitus >= 0 && minitus <= 30) { 
            const data = JSON.stringify({ "msgtype": "text", "text": { "content": `一切正常, offline count: ${offlineCount}, validator count: ${validatorCount}, validator offlineRate: ${offlineRate}` }, "at": { "atMobiles": "['validator]", "isAtAll": false } });
            const config = {
                method: 'post',
                url: ddurl,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            axios(config).then(function (response: { data: any; }) {
                console.log(JSON.stringify(response.data));
            }).catch(function (error: any) {
                console.log(error);
            });
        }
    }

}

const getNodeStatus = async () => {
    const _api = await mainnetApi.isReadyOrError;
    const activeEra = parseObj(await _api.query.staking.activeEra()).index;
    console.log('currentEra < activeEra', currentEra < activeEra)
    if (currentEra < activeEra) {
        // 等待10分钟后再查询掉线状态
        currentEra = activeEra;
        await sleep(60 * 1000 * 15);
        await maybeDoDingdingcall(_api, activeEra)
    } else {
        await maybeDoDingdingcall(_api, activeEra)
    }
}

const main = async () => {
    for (; ;) {
        await getNodeStatus();
        await sleep(60 * 1000 * 20)
    }
}

main().catch(e => {
    l.error(e);
    process.exit(1);
});
