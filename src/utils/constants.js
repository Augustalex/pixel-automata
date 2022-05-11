const standard = 1440;
const scale = window.innerHeight / standard;

export const TileSize = window.innerHeight < 800 ? 6 : Math.round(22 * scale);
export const WorldWidth = 80;
export const WorldHeight = 53;