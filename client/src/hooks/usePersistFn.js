"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePersistFn = usePersistFn;
const react_1 = require("react");
/**
 * usePersistFn instead of useCallback to reduce cognitive load
 */
function usePersistFn(fn) {
    const fnRef = (0, react_1.useRef)(fn);
    fnRef.current = fn;
    const persistFn = (0, react_1.useRef)(null);
    if (!persistFn.current) {
        persistFn.current = function (...args) {
            return fnRef.current.apply(this, args);
        };
    }
    return persistFn.current;
}
