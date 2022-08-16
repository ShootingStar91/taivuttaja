"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WORDLIST_TITLE_MAX = exports.WORDLIST_TITLE_MIN = exports.USERNAME_MAX_LENGTH = exports.USERNAME_MIN_LENGTH = exports.PASSWORD_MAX_LENGTH = exports.PASSWORD_MIN_LENGTH = exports.LOGIN_VALID_SECONDS = exports.SECRET = exports.TEST_MONGODB_URI = exports.MONGODB_URI = exports.PORT = exports.TEST_MODE = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.TEST_MODE = process.env.TEST_MODE;
exports.PORT = process.env.PORT || 3001;
exports.MONGODB_URI = process.env.MONGODB_URI;
exports.TEST_MONGODB_URI = process.env.TEST_MONGODB_URI;
exports.SECRET = process.env.SECRET;
exports.LOGIN_VALID_SECONDS = 48 * 60 * 60;
exports.PASSWORD_MIN_LENGTH = 5;
exports.PASSWORD_MAX_LENGTH = 18;
exports.USERNAME_MIN_LENGTH = 5;
exports.USERNAME_MAX_LENGTH = 16;
exports.WORDLIST_TITLE_MIN = 3;
exports.WORDLIST_TITLE_MAX = 30;
