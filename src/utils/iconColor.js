import {FarmType} from "@/utils/farmUtils";

export function iconColor(tileInfo) {
    if (tileInfo.title === 'grass') return [
        120,
        70,
        76,
        1
    ];
    if (tileInfo.title === FarmType.Grain) return [
        50,
        85,
        55,
        1
    ];
    if (tileInfo.title === FarmType.Mushrooms) return [
        120,
        85,
        55,
        1
    ];
    if(tileInfo.title === 'pipe') return [
        35,
        70,
        50,
        1
    ];
    if (tileInfo.title === 'zone-city') return [
        350,
        0,
        80,
        1
    ];
    if (tileInfo.title === 'humidifier') return [
        120,
        30,
        55,
        1
    ];
    if (tileInfo.title === 'dig') return [
        27,
        50,
        10,
        1
    ];
    if (tileInfo.title === 'raise') return [
        27,
        60,
        60,
        1
    ];
    return [0, 0, 0, 1];
}