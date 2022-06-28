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
const mongoose_1 = __importDefault(require("mongoose"));
const middleware_1 = __importDefault(require("./middleware"));
const words_1 = __importDefault(require("./routes/words"));
const user_1 = __importDefault(require("./routes/user"));
const wordlists_1 = __importDefault(require("./routes/wordlists"));
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
const User_1 = require("./models/User");
require('express-async-errors');
//import { wordModel } from './models/Word';
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static('build'));
app.use(middleware_1.default.logger);
app.use(middleware_1.default.tokenExtractor);
if (config_1.TEST_MODE) {
    console.log("Running in TEST_MODE");
}
else {
    console.log("Running in normal mode");
}
const mongo_url = config_1.TEST_MODE ? config_1.TEST_MONGODB_URI : config_1.MONGODB_URI;
mongoose_1.default.connect(mongo_url, {}).then(() => {
    console.log('Connected to MongoDB!');
}).catch((error) => {
    console.log('Error connecting to MongoDB: ' + error.message);
});
const allowedOrigins = ['http://localhost:3000'];
const options = {
    origin: allowedOrigins
};
app.use((0, cors_1.default)(options));
// These have to be AFTER cors!
app.use('/api/words', words_1.default);
app.use('/api/user', user_1.default);
app.use('/api/wordlists', wordlists_1.default);
app.get('/health', (_req, res) => {
    res.send('ok');
});
app.get('/api/test/deleteall', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!config_1.TEST_MODE) {
        res.send("Not in test mode!");
    }
    yield User_1.userModel.deleteMany({});
    console.log("users deleted");
    res.send("ok");
}));
app.use(middleware_1.default.unknownEndpoint);
app.use(middleware_1.default.errorHandler);
module.exports = app;
exports.default = app;
