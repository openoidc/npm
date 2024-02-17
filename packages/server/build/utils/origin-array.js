"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toOriginArray = void 0;
var toOriginArray = function (s) {
    if (!s)
        return [];
    var originList = (s || '').split(',').map(function (s) { return s.trim(); });
    return originList.map(function (origin) {
        var originParts = origin.split('.');
        // Search for the specific pattern: domain.tld (e.g. maybe.co) and enable wildcard access on domain
        if (originParts.length === 2) {
            return new RegExp("".concat(originParts[0], "\\.").concat(originParts[1]));
        }
        else {
            return origin;
        }
    });
};
exports.toOriginArray = toOriginArray;
