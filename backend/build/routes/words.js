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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
require('express-async-errors');
const express_1 = __importDefault(require("express"));
const words_1 = __importDefault(require("../services/words"));
const validators_1 = require("../utils/validators");
const router = express_1.default.Router();
// /api/words/...
/*

  get / -path will return a single word in the desired tense and mood.
  Omitting word will result in a random word.
  omit by -, example
  /api/words/word/en/-/tense/Present/mood/Indicative/
  after /word/ comes language of the given word param: 'en' or 'es'
*/
router.get('/word/:lang/:word/tense/:tense/mood/:mood/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const word = req.params.word;
    const rawMood = req.params.mood;
    const rawTense = req.params.tense;
    const lang = req.params.lang;
    if (!(0, validators_1.isLanguage)(lang)) {
        throw new Error('Invalid language parameter. Give either \'en\' or \'es\'');
    }
    if (!rawMood || !rawTense) {
        throw new Error('Mood or tense missing');
    }
    const mood = rawMood.charAt(0).toUpperCase() + rawMood.slice(1);
    const tense = rawTense.charAt(0).toUpperCase() + rawTense.slice(1);
    if (!(0, validators_1.isMood)(mood) || !(0, validators_1.isTense)(tense)) {
        throw new Error('Mood or tense invalid');
    }
    if ((0, validators_1.isString)(word) && word !== '-') {
        // Get specific word
        const result = yield words_1.default.getWord(word, lang, tense, mood);
        return res.send(result);
    }
    else if ((0, validators_1.isString)(word) && word === '-') {
        const word = yield words_1.default.getRandomWord(tense, mood);
        return res.send(word);
    }
    throw new Error('Word invalid. Either give valid string word, or a dash (-) for random.');
}));
router.get('/random', (_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const word = yield words_1.default.getRandomWord('Present', 'Indicative');
    res.send(word);
}));
router.get('/verbdetails/:verb', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verb = req.params.verb;
    const result = yield words_1.default.getVerbDetails(verb);
    res.send(result);
}));
router.get('/allwordsstripped', (_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield words_1.default.getStrippedWords();
    res.send(result);
}));
exports.default = router;
