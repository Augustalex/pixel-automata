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
        80,
        1
    ];
    return [0, 0, 0, 1];
}