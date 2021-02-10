export interface ExcludeConstructor {
    operations: string[];
}
declare class Exclude {
    operations: string[];
    constructor(input: ExcludeConstructor);
}
export default Exclude;
