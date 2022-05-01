
export function toCssRgbColor() {

}

export function toCssHslColor([hue, saturation, lightness, alpha = 1]) {
    return `hsla(${hue},${saturation}%,${lightness}%,${alpha})`;
}