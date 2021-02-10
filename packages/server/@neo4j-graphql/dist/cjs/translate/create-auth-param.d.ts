import { Context } from "../classes";
declare function createAuthParam({ context }: {
    context: Context;
}): {
    isAuthenticated: boolean;
    roles?: string[] | undefined;
    jwt: any;
};
export default createAuthParam;
