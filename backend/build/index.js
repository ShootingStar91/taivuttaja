"use strict";
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
require('express-async-errors');
//import { wordModel } from './models/Word';
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static('build'));
app.use(middleware_1.default.logger);
app.use(middleware_1.default.tokenExtractor);
mongoose_1.default.connect(config_1.MONGODB_URI, {}).then(() => {
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
app.use(middleware_1.default.unknownEndpoint);
app.use(middleware_1.default.errorHandler);
app.listen(config_1.PORT, () => {
    console.log();
    console.log(`Server running on port ${config_1.PORT}`);
});
