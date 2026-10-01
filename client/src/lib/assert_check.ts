// type assertion to force tsc to fully evaluate AppRouter
import type { AppRouter } from "../../../server/routers";
type SaeisKeys = keyof AppRouter["saeis"];
const _check: SaeisKeys = "dashboard" as SaeisKeys;
