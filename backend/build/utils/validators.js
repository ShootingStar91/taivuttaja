"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLanguage = exports.isMood = exports.isTense = exports.isString = void 0;
const types_1 = require("../types");
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
exports.isString = isString;
const isTense = (text) => {
    return (0, exports.isString)(text) && types_1.tenseList.includes(text);
};
exports.isTense = isTense;
const isMood = (text) => {
    return (0, exports.isString)(text) && types_1.moodList.includes(text);
};
exports.isMood = isMood;
const isLanguage = (text) => {
    return (0, exports.isString)(text) && text === types_1.Language.English || text === types_1.Language.Spanish;
};
exports.isLanguage = isLanguage;
