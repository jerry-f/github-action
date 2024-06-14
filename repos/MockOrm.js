"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonfile_1 = __importDefault(require("jsonfile"));
const fs_1 = __importDefault(require("fs"));
const DB_FILE_NAME = 'database.json';
fs_1.default.stat(__dirname + '/' + DB_FILE_NAME, (err) => {
    if (err) {
        fs_1.default.writeFileSync(__dirname + '/' + DB_FILE_NAME, JSON.stringify({ users: [] }));
    }
});
function openDb() {
    return jsonfile_1.default.readFile(__dirname + '/' + DB_FILE_NAME);
}
function saveDb(db) {
    return jsonfile_1.default.writeFile((__dirname + '/' + DB_FILE_NAME), db);
}
exports.default = {
    openDb,
    saveDb,
};
