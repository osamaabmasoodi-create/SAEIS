import "./assert_check";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../server/routers";

export const trpc = createTRPCReact<AppRouter>();


// Type assertion: ensure saeis router has expected procedures (compile-time)
type SaeisRouter = (typeof import("../../../server/routers").appRouter)["_def"]["record"]["saeis"];
const _saesisKeys: Array<keyof SaeisRouter> = ["dashboard", "erpRecords", "bankRecords", "matches", "alerts", "seed"];
