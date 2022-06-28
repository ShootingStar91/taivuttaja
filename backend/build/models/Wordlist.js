"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordlistModel = void 0;
const mongoose_1 = require("mongoose");
const wordlistSchema = new mongoose_1.Schema({
    title: String,
    words: [String],
    owner: mongoose_1.Schema.Types.ObjectId
});
exports.wordlistModel = (0, mongoose_1.model)('Wordlist', wordlistSchema);
