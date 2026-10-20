"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = useAuth;
const const_1 = require("@/const");
const trpc_1 = require("@/lib/trpc");
const client_1 = require("@trpc/client");
const react_1 = require("react");
function useAuth(options) {
    // Login is started via startLogin() in the effect below, only when we actually
    // navigate — never during render. startLogin() mints a one-time nonce + writes
    // the state cookie, so calling it per render would overwrite the cookie and
    // desync it from an in-flight login's `state`.
    const { redirectOnUnauthenticated = false, redirectPath } = options ?? {};
    const utils = trpc_1.trpc.useUtils();
    const meQuery = trpc_1.trpc.auth.me.useQuery(undefined, {
        retry: false,
        refetchOnWindowFocus: false,
    });
    const logoutMutation = trpc_1.trpc.auth.logout.useMutation({
        onSuccess: () => {
            utils.auth.me.setData(undefined, null);
        },
    });
    const logout = (0, react_1.useCallback)(async () => {
        try {
            await logoutMutation.mutateAsync();
        }
        catch (error) {
            if (error instanceof client_1.TRPCClientError &&
                error.data?.code === "UNAUTHORIZED") {
                return;
            }
            throw error;
        }
        finally {
            // Clear the Preview auto-login token mirrored into sessionStorage, so
            // header-based sessions (Safari ITP / WebView) are logged out too. The
            // backend cookie is cleared by the logout mutation.
            try {
                sessionStorage.removeItem("manus-cookie");
            }
            catch { }
            utils.auth.me.setData(undefined, null);
            await utils.auth.me.invalidate();
        }
    }, [logoutMutation, utils]);
    const state = (0, react_1.useMemo)(() => {
        localStorage.setItem("manus-runtime-user-info", JSON.stringify(meQuery.data));
        return {
            user: meQuery.data ?? null,
            loading: meQuery.isLoading || logoutMutation.isPending,
            error: meQuery.error ?? logoutMutation.error ?? null,
            isAuthenticated: Boolean(meQuery.data),
        };
    }, [
        meQuery.data,
        meQuery.error,
        meQuery.isLoading,
        logoutMutation.error,
        logoutMutation.isPending,
    ]);
    (0, react_1.useEffect)(() => {
        if (!redirectOnUnauthenticated)
            return;
        if (meQuery.isLoading || logoutMutation.isPending)
            return;
        if (state.user)
            return;
        if (typeof window === "undefined")
            return;
        if (redirectPath && window.location.pathname === redirectPath)
            return;
        // Navigate at this moment only. startLogin() mints the nonce + cookie itself.
        if (redirectPath) {
            window.location.href = redirectPath;
        }
        else {
            (0, const_1.startLogin)();
        }
    }, [
        redirectOnUnauthenticated,
        redirectPath,
        logoutMutation.isPending,
        meQuery.isLoading,
        state.user,
    ]);
    return {
        ...state,
        refresh: () => meQuery.refetch(),
        logout,
    };
}
