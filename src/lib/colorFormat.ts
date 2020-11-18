import { format } from "winston";
import supportsColor from "supports-color";

// https://github.com/visionmedia/debug/blob/3f56313c1e4a0d59c1054fb9b10026b6903bfba7/src/common.js#L41
const cache: Record<string, number | string> = {}; // color cache
let colors: number[] = [6, 2, 3, 4, 5, 1];

if (supportsColor && supportsColor.stderr.level >= 2) {
  colors = [
    20,
    21,
    26,
    27,
    32,
    33,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    56,
    57,
    62,
    63,
    68,
    69,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    92,
    93,
    98,
    99,
    112,
    113,
    128,
    129,
    134,
    135,
    148,
    149,
    160,
    161,
    162,
    163,
    164,
    165,
    166,
    167,
    168,
    169,
    170,
    171,
    172,
    173,
    178,
    179,
    184,
    185,
    196,
    197,
    198,
    199,
    200,
    201,
    202,
    203,
    204,
    205,
    206,
    207,
    208,
    209,
    214,
    215,
    220,
    221,
  ];
}

/**
 * Selects a color for a debug namespace
 * @param {string} namespace The namespace string for the for the debug instance to be colored
 * @return {number | string} An ANSI color code for the given namespace
 */
function selectColor(namespace: string): number | string {
  let hash = 0;

  for (let i = 0; i < namespace.length; i++) {
    hash = (hash << 5) - hash + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return colors[Math.abs(hash) % colors.length];
}

/**
 * @param {string} namespace
 * @return {string} colored namespace
 */
function useColor(namespace: string): string {
  if (!namespace) return "";

  const c = cache[namespace] || (cache[namespace] = selectColor(namespace));
  const colorCode = "\u001B[3" + (c < 8 ? c : "8;5;" + c);
  return `${colorCode};1m${namespace}\u001B[0m`;
}

const colorFormat = format((info, opts) => {
  if (!opts.useColor) return info;

  info.label = useColor(info.label);
  return info;
});

export default colorFormat;
