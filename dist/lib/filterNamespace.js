"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var namespaceStr = process.env.LOG_NAMESPACES || "";
var include = [];
var exclude = [];
// https://github.com/visionmedia/debug/blob/master/src/common.js#L156-L173
var i;
var split = (namespaceStr || "").split(/[\s,]+/);
var len = split.length;
for (i = 0; i < len; i++) {
    if (!split[i]) {
        // ignore empty strings
        continue;
    }
    namespaceStr = split[i].replace(/\*/g, ".*?");
    if (namespaceStr[0] === "-") {
        exclude.push(new RegExp("^" + namespaceStr.substr(1) + "$"));
    }
    else {
        include.push(new RegExp("^" + namespaceStr + "$"));
    }
}
/**
 * @param {string} namespace
 * @return {boolean} return true if a namespace is not filterred.
 */
function filterNamespace(namespace) {
    for (var _i = 0, exclude_1 = exclude; _i < exclude_1.length; _i++) {
        var r = exclude_1[_i];
        if (r.test(namespace))
            return false;
    }
    if (include.length === 0)
        return true;
    for (var _a = 0, include_1 = include; _a < include_1.length; _a++) {
        var r = include_1[_a];
        if (r.test(namespace))
            return true;
    }
}
exports.default = filterNamespace;
