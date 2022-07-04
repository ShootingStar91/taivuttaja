"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doneWordModel = void 0;
const mongoose_1 = require("mongoose");
const doneWordSchema = new mongoose_1.Schema({
    word: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    date: Date,
    user: mongoose_1.Schema.Types.ObjectId
});
exports.doneWordModel = (0, mongoose_1.model)('Doneword', doneWordSchema);
