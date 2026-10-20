"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
const path_1 = __importDefault(require("path"));
const templateRoot = path_1.default.resolve(import.meta.dirname);
exports.default = (0, config_1.defineConfig)({
    root: templateRoot,
    resolve: {
        alias: {
            "@": path_1.default.resolve(templateRoot, "client", "src"),
            "@shared": path_1.default.resolve(templateRoot, "shared"),
            "@assets": path_1.default.resolve(templateRoot, "attached_assets"),
        },
    },
    test: {
        environment: "node",
        include: ["server/**/*.test.ts", "server/**/*.spec.ts"],
    },
});
