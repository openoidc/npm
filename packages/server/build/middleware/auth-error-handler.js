"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authErrorHandler = void 0;
var ability_1 = require("@casl/ability");
var authErrorHandler = function (err, req, res, next) {
    if (err instanceof ability_1.ForbiddenError) {
        return res.status(403).json({
            errors: [
                {
                    status: '403',
                    title: 'Unauthorized',
                    detail: err.message,
                },
            ],
        });
    }
    next(err);
};
exports.authErrorHandler = authErrorHandler;
