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
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const config_1 = require("./config");
const User_1 = require("./models/User");
const logger = (request, _response, next) => {
    console.log(`${request.method}: ${request.path}`);
    if (request.method === 'POST') {
        console.log(request.body);
    }
    void next();
};
const tokenExtractor = (request, _response, next) => {
    const authorization = request.get('authorization');
    request.token = (authorization && authorization.toLowerCase().startsWith('bearer '))
        ? authorization.substring(7)
        : null;
    void next();
};
const userExtractor = (request, response, next) => {
    if (request.token === undefined || request.token === null) {
        throw new jsonwebtoken_1.JsonWebTokenError("Invalid token");
    }
    jsonwebtoken_1.default.verify(request.token, config_1.SECRET, (_err, decoded) => {
        if (!decoded) {
            throw new jsonwebtoken_1.JsonWebTokenError("Token has expired");
        }
        const id = decoded.id;
        User_1.userModel.findById(id).then(user => {
            if (user) {
                request.user = user;
                return next();
            }
            else {
                throw new jsonwebtoken_1.JsonWebTokenError("Invalid token");
            }
        }).catch(_e => response.status(500).json({ error: 'Internal server error at user extraction' }));
        return;
    });
    return;
};
const errorHandler = (err, _req, res, _next) => {
    console.log("Error: ", err.message);
    if (err.name === 'CastError') {
        return res.status(400).send({ message: "Invalid id" });
    }
    else if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    else if (err.name === 'JsonWebTokenError') {
        return res.status(401).send({ message: "Login invalid or expired. Please try to login again" });
    }
    else if (err.name === 'TokenExpiredError') {
        return res.status(401).send({ message: 'Login expired' });
    }
    else if (err.name === 'MongoServerError') {
        const mongoError = err;
        if (mongoError.code === 11000) {
            return res.status(400).send({ message: "Username already exists" });
        }
        return res.status(400).send({ message: "Error in database" });
    }
    return res.status(400).send({ message: err.message });
};
const unknownEndpoint = (_req, res) => {
    res.status(404).send({ error: 'Unknown endpoint' });
};
exports.default = {
    logger, tokenExtractor, userExtractor, errorHandler, unknownEndpoint
};
