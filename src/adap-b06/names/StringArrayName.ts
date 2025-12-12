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

    public setComponent(i: number, c: string): StringArrayName {
        IllegalArgumentException.assert(i != null && c != null);
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents());
        IllegalArgumentException.assert(this.isEscapedComponentString(c))

        let components = [ ...this.components ];
        components[i] = c;
        return new StringArrayName(components, this.delimiter);
    }

    public insert(i: number, c: string): StringArrayName {
        IllegalArgumentException.assert(i != null && c != null);
        IllegalArgumentException.assert(i >= 0 && i <= this.getNoComponents());
        IllegalArgumentException.assert(this.isEscapedComponentString(c))

        let components = [...this.components];
        components.splice(i, 0, c);
        return new StringArrayName(components, this.delimiter);
    }

    public append(c: string): StringArrayName {
        IllegalArgumentException.assert(c != null);
        IllegalArgumentException.assert(this.isEscapedComponentString(c))

        let components = [...this.components];
        components.push(c);
        return new StringArrayName(components, this.delimiter);
    }

    public remove(i: number): StringArrayName {
        IllegalArgumentException.assert(i != null);
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents());

        let components = [...this.components];
        components.splice(i, 1);
        return new StringArrayName(components, this.delimiter);
    }
}