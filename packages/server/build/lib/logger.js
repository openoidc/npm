"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = require("winston");
var createLogger = function (opts) {
    var defaultTransport = new winston_1.transports.Console({
        format: process.env.NODE_ENV === 'production'
            ? winston_1.format.json()
            : winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple()),
        handleExceptions: true,
    });
    var transports = !(opts === null || opts === void 0 ? void 0 : opts.transports)
        ? defaultTransport
        : Array.isArray(opts.transports)
            ? __spreadArray([defaultTransport], opts.transports, true) : [defaultTransport, opts.transports];
    return (0, winston_1.createLogger)(__assign(__assign({}, opts), { transports: transports }));
};
var logger = createLogger({
    level: (_a = process.env.LOG_LEVEL) !== null && _a !== void 0 ? _a : 'info',
});
exports.default = logger;
