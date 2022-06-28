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
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("../middleware"));
const wordlists_1 = __importDefault(require("../services/wordlists"));
require('express-async-errors');
const router = express_1.default.Router();
router.post('/deleteword/', middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield wordlists_1.default.deleteWord(req.body.word, req.body.wordlistId, req.user._id);
    res.status(200).send();
}));
router.post('/addword/', middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wordlists_1.default.addWord(req.body.word, req.body.wordlistId, req.user._id);
    if (!result) {
        throw new Error("Error adding word to wordlist");
    }
    res.send(result);
}));
router.get('/', middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Returns all owners wordlists
    const result = yield wordlists_1.default.getUsersLists(req.user._id);
    res.json(result);
}));
router.get('/:id', middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wordlists_1.default.getList(req.params.id, req.user._id);
    res.json(result);
}));
router.post('/create/', middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const savedWordlist = yield wordlists_1.default.create(req.body.wordlist.title, req.user._id);
    res.status(200).send(savedWordlist);
}));
router.post('/delete/', middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield wordlists_1.default.deleteWordlist(req.body.wordlistId, req.user._id);
    res.status(200).send();
}));
exports.default = router;
