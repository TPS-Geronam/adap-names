import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        IllegalArgumentException.assert(source != null);

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
        IllegalArgumentException.assert(i != null);
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents());

        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        IllegalArgumentException.assert(i != null && c != null);
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents());
        IllegalArgumentException.assert(this.isEscapedComponentString(c))

        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        IllegalArgumentException.assert(i != null && c != null);
        IllegalArgumentException.assert(i >= 0 && i <= this.getNoComponents());
        IllegalArgumentException.assert(this.isEscapedComponentString(c))

        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        IllegalArgumentException.assert(c != null);
        IllegalArgumentException.assert(this.isEscapedComponentString(c))

        this.components.push(c);
    }

    public remove(i: number): void {
        IllegalArgumentException.assert(i != null);
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents());

        this.components.splice(i, 1);
    }
}