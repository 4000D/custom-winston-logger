let namespaceStr = process.env.LOG_NAMESPACES || "";

const include: RegExp[] = [];
const exclude: RegExp[] = [];

// https://github.com/visionmedia/debug/blob/master/src/common.js#L156-L173
let i;
const split = (namespaceStr || "").split(/[\s,]+/);
const len = split.length;

for (i = 0; i < len; i++) {
  if (!split[i]) {
    // ignore empty strings
    continue;
  }

  namespaceStr = split[i].replace(/\*/g, ".*?");

  if (namespaceStr[0] === "-") {
    exclude.push(new RegExp("^" + namespaceStr.substr(1) + "$"));
  } else {
    include.push(new RegExp("^" + namespaceStr + "$"));
  }
}

/**
 * @param {string} namespace
 * @return {boolean} return true if a namespace is not filterred.
 */
export default function filterNamespace(namespace: string) {
  for (const r of exclude) {
    if (r.test(namespace)) return false;
  }

  if (include.length === 0) return true;
  for (const r of include) {
    if (r.test(namespace)) return true;
  }
}
