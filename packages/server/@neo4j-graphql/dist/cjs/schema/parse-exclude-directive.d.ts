import { DirectiveNode } from "graphql";
import { Exclude } from "../classes";
declare function parseExcludeDirective(excludeDirective: DirectiveNode, type: string): Exclude;
export default parseExcludeDirective;
