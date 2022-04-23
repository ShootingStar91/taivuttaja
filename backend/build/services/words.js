"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Word_1 = require("../models/Word");
const types_1 = require("../types");
const getWord = (word, language, tense, mood) => __awaiter(void 0, void 0, void 0, function* () {
    if (language === types_1.Language.English) {
        return yield Word_1.wordModel.findOne({ infinitive_english: word, mood_english: mood, tense_english: tense });
    }
    else {
        return yield Word_1.wordModel.findOne({ infinitive: word, mood_english: mood, tense_english: tense });
    }
});
const getRandomWord = (tense, mood) => __awaiter(void 0, void 0, void 0, function* () {
    const wordArray = yield Word_1.wordModel.aggregate([{ $match: { tense_english: tense, mood_english: mood } }, { $sample: { size: 1 } }]);
    if (!wordArray || wordArray.length !== 1) {
        throw new Error("Error randoming word");
    }
    return wordArray[0];
});
const getStrippedWords = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Word_1.wordModel.find({ tense_english: 'Present', mood_english: 'Indicative' }, 'infinitive infinitive_english');
    return result;
});
exports.default = {
    getWord,
    getRandomWord,
    getStrippedWords
};
