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
// Disable this for router files because the async routes are ok and necessary
require('express-async-errors');
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../services/user"));
const middleware_1 = __importDefault(require("../middleware"));
const router = express_1.default.Router();
// /api/user/...
router.post(`/create/`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.default.createUser(req.body.username, req.body.password);
    res.status(200).send(true);
}));
router.post(`/login/`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.tryLogin(req.body.username, req.body.password);
    res.status(200).send(user);
}));
router.post('/deleteuser/', middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.default.deleteUser(req.user);
    res.status(200).send();
}));
router.post('/doneword/', middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.default.addDoneWord(req.body.wordId, req.user);
    res.status(200).send();
}));
router.get('/donewords/', middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_1.default.getDoneWords(req.user);
    res.status(200).send(result);
}));
router.post('/goal/', middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_1.default.setGoal(req.body.goal, req.user);
    res.status(200).send(result);
}));
router.post('/changepassword/', middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_1.default.changePassword(req.body.currentPassword, req.body.newPassword, req.user);
    res.status(200).send(result);
}));
// Deprecated ?
router.post('/relog/', middleware_1.default.userExtractor, (req, res) => {
    const result = user_1.default.relog(req.user);
    res.status(200).send(result);
});
router.post('/setstrictaccents/', middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_1.default.setStrictAccents(req.body.strictAccents, req.user);
    res.status(200).send(result);
}));
exports.default = router;
