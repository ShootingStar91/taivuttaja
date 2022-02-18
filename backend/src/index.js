"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var app = (0, express_1["default"])();
app.use(express_1["default"].json());
app.use(express_1["default"].static('build'));
app.get('/', function (_req, res) {
    res.send('Hola mundo, desde backend');
});
var PORT = 3001;
app.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});
console.log('file ran');
