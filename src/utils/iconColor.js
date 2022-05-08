export function iconColor(tileInfo) {
    if (tileInfo.title === 'grass') return [
        120,
        70,
        76,
        1
    ];
    if (tileInfo.title === 'farm') return [
        60,
        90,
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
        350,
        60,
        80,
        1
    ];
    if (tileInfo.title === 'dig') return [
        350,
        0,
        20,
        1
    ];
    if (tileInfo.title === 'raise') return [
        350,
        0,
        90,
        1
    ];
    return [0, 0, 0, 1];
}