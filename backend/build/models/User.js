"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = require("mongoose");
const config_1 = require("../config");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true, minlength: config_1.USERNAME_MIN_LENGTH, maxlength: config_1.USERNAME_MAX_LENGTH },
    password: { type: String, required: true },
    goal: { type: Number },
});
exports.userModel = (0, mongoose_1.model)('User', userSchema);
