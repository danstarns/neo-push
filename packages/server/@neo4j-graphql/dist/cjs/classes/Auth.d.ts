import { AuthOperations } from "../types";
export declare type AuthRule = {
    isAuthenticated?: boolean;
    operations?: AuthOperations[];
    allow?: {
        [k: string]: any;
    } | "*";
    roles?: string[];
};
export interface AuthConstructor {
    rules: AuthRule[];
}
declare class Auth {
    rules: AuthRule[];
    type: "JWT";
    constructor(input: AuthConstructor);
}
export default Auth;
