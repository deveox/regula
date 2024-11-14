import { Base } from "./Base.js";

export class Text extends Base {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    constructor(config: Text.Config) {
        super(config);
        this.minLength = config.minLength;
        this.maxLength = config.maxLength;
        this.pattern = config.pattern;
    }
}

export namespace Text {
    export interface Config extends Base.Config {
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
    }
}