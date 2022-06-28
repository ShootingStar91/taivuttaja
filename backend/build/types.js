"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.Language = exports.moodList = exports.tenseList = void 0;
exports.tenseList = ['Present', 'Imperfect', 'Preterite', 'Present Perfect', 'Past Perfect', 'Future Perfect', 'Conditional Perfect', 'Future', 'Preterite (Archaic)', 'Conditional'];
exports.moodList = ['Indicative', 'Subjunctive', 'Imperative Affirmative', 'Imperative Negative'];
var Language;
(function (Language) {
    Language["English"] = "en";
    Language["Spanish"] = "es";
})(Language = exports.Language || (exports.Language = {}));
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
