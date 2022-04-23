"use strict";
/* eslint-disable @typescript-eslint/no-misused-promises */
// Temporary snippets for gathering all valid combinations of moods and tenses existing in the database
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
exports.checkEmptyForms = exports.checkValidMoodTenses = void 0;
const Word_1 = require("./models/Word");
const types_1 = require("./types");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkValidMoodTenses = () => {
    types_1.tenseList.forEach(tense => {
        types_1.moodList.forEach((mood) => __awaiter(void 0, void 0, void 0, function* () {
            const wordCount = yield Word_1.wordModel.countDocuments({ mood_english: mood, tense_english: tense }).count();
            if (wordCount > 0)
                console.log(`${mood}, ${tense}, ${wordCount}`);
        }));
    });
};
exports.checkValidMoodTenses = checkValidMoodTenses;
const checkEmptyForms = () => __awaiter(void 0, void 0, void 0, function* () {
    const words = yield Word_1.wordModel.find({});
    words.forEach(w => {
        if ((w.form_1p === "" || w.form_2p === "" || w.form_3p === "" || w.form_1s === "" || w.form_2s === "" || w.form_3s === "") && w.mood_english === "Indicative") {
            console.log(w);
        }
    });
});
exports.checkEmptyForms = checkEmptyForms;
