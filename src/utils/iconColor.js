export function iconColor(tileInfo) {
    if (tileInfo.title === 'grass') return [
        120,
        70,
        76,
        1
    ];
    if (tileInfo.title === 'farm') return [
        50,
        85,
        55,
        1
    ];
    if (tileInfo.title === 'zone-city') return [
        350,
        0,
        80,
        1
    ];
    if (tileInfo.title === 'humidifier') return [
        350,
        60,
        80,
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