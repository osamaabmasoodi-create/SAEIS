"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trpc = void 0;
require("./assert_check");
const react_query_1 = require("@trpc/react-query");
exports.trpc = (0, react_query_1.createTRPCReact)();
const _saesisKeys = ["dashboard", "erpRecords", "bankRecords", "matches", "alerts", "seed"];
