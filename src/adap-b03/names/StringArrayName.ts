import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter)
        this.components = source;
    }

    public clone(): StringArrayName {
        return new StringArrayName(
            this.components,
            this.getDelimiterCharacter()
        );
    }

    public asDataString(): string {
        let escaped: string[] = [];
        this.components.forEach(
            c => escaped.push(
                c.split(this.delimiter)
                    .join(`${ESCAPE_CHARACTER}${this.delimiter}`))
        );
        return escaped.join(this.delimiter);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.components.splice(i, 1);
    }
}