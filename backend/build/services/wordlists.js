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
exports.isWordArray = void 0;
const config_1 = require("../config");
const Word_1 = require("../models/Word");
const Wordlist_1 = require("../models/Wordlist");
const validators_1 = require("../utils/validators");
const isWordArray = (words) => {
    // Possibly useless typeguard
    if (!Array.isArray(words)) {
        return false;
    }
    if (words.length === 0 || typeof words[0] !== "string") {
        return false;
    }
    return true;
};
exports.isWordArray = isWordArray;
const addWord = (word, wordlistId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, validators_1.isString)(word) || !(0, validators_1.isString)(wordlistId)) {
        throw new Error("Invalid parameters");
    }
    const result = yield Wordlist_1.wordlistModel.findOneAndUpdate({ _id: wordlistId, owner: userId }, { $push: { words: word } });
    if (!result) {
        throw new Error('Wordlist not found');
    }
    return result;
});
const deleteWord = (word, wordlistId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, validators_1.isString)(word) || !(0, validators_1.isString)(wordlistId)) {
        throw new Error("Invalid parameters");
    }
    const result = yield Wordlist_1.wordlistModel.findOneAndUpdate({ _id: wordlistId, owner: userId }, { $pull: { words: word } });
    if (!result) {
        throw new Error('Wordlist not found');
    }
});
const deleteWordlist = (wordlistId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, validators_1.isString)(wordlistId)) {
        throw new Error("Invalid parameters");
    }
    const result = yield Wordlist_1.wordlistModel.findOneAndRemove({ _id: wordlistId, owner: userId });
    if (!result) {
        throw new Error('Wordlist not found');
    }
});
const create = (title, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, validators_1.isString)(title) || title.length < config_1.WORDLIST_TITLE_MIN || title.length > config_1.WORDLIST_TITLE_MAX) {
        throw new Error(`Wordlist title must be a valid string of length ${config_1.WORDLIST_TITLE_MIN}-${config_1.WORDLIST_TITLE_MAX}`);
    }
    const words = [];
    const nameExists = yield Wordlist_1.wordlistModel.findOne({ title, owner: userId });
    console.log(nameExists);
    if (nameExists) {
        throw new Error('Wordlist with that name already exists. Select a different name');
    }
    const newWordlist = new Wordlist_1.wordlistModel({ title, words, owner: userId });
    const savedWordlist = yield newWordlist.save();
    if (!savedWordlist) {
        throw new Error("Creating wordlist failed on database");
    }
    return savedWordlist;
});
const getUsersLists = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Wordlist_1.wordlistModel.find({ owner: userId });
});
const getList = (wordlistId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, validators_1.isString)(wordlistId)) {
        throw new Error("Invalid parameters");
    }
    const wordlist = yield Wordlist_1.wordlistModel.findOne({ _id: wordlistId, owner: userId }).exec();
    if (!wordlist) {
        throw new Error("No such wordlist id found from this user");
    }
    const getStrippedWords = () => __awaiter(void 0, void 0, void 0, function* () {
        // Fill wordlist's word array with strippedwords so that they include spanish word too
        const strippedWords = [];
        for (const word of wordlist.words) {
            const result = yield Word_1.wordModel.findOne({ infinitive_english: word }, 'infinitive infinitive_english').exec();
            if (result) {
                strippedWords.push(result);
            }
        }
        return strippedWords;
    });
    const frontendWordlist = { title: wordlist.title, owner: wordlist.owner, _id: wordlist._id, words: yield getStrippedWords() };
    console.log("frontendwordlist:");
    console.log(frontendWordlist);
    return frontendWordlist;
});
exports.default = {
    create,
    addWord,
    deleteWord,
    getUsersLists,
    getList,
    deleteWordlist
};
