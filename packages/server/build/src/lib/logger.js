"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("@maybe-finance/server/shared");
var logger = (0, shared_1.createLogger)({
    level: (_a = process.env.LOG_LEVEL) !== null && _a !== void 0 ? _a : 'info',
});
exports.default = logger;
