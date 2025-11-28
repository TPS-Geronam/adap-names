import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        IllegalArgumentException.assert(source != null);

        super(delimiter);
        this.name = source;
        this.noComponents = this.asArray().length;
    }

    public clone(): StringName {
        return new StringName(
            this.name,
            this.getDelimiterCharacter()
        );
    }

    public asDataString(): string {
        let escaped: string[] = [];
        this.asArray().forEach(
            c => escaped.push(
                c.split(this.delimiter)
                    .join(`${ESCAPE_CHARACTER}${this.delimiter}`))
        );
        return escaped.map(
            c => c.replaceAll(
                `${ESCAPE_CHARACTER}${ESCAPE_CHARACTER}${this.delimiter}`,
                `${ESCAPE_CHARACTER}${this.delimiter}`
            )).join(this.delimiter);
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(i != null);
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents());

        return this.asArray()[i];
    }

    public setComponent(i: number, c: string): void {
        IllegalArgumentException.assert(i != null && c != null);
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents());
        IllegalArgumentException.assert(this.isEscapedComponentString(c))

        let components: string[] = this.asArray();
        components[i] = c;
        this.name = components.join(this.delimiter);
    }

    public insert(i: number, c: string): void {
        IllegalArgumentException.assert(i != null && c != null);
        IllegalArgumentException.assert(i >= 0 && i <= this.getNoComponents());
        IllegalArgumentException.assert(this.isEscapedComponentString(c))

        let components: string[] = this.asArray();
        components.splice(i, 0, c);
        this.noComponents += 1;
        this.name = components.join(this.delimiter);
    }

    public append(c: string): void {
        IllegalArgumentException.assert(c != null);
        IllegalArgumentException.assert(this.isEscapedComponentString(c))

        this.noComponents += 1;
        this.name += `${this.delimiter}${c}`;
    }

    public remove(i: number): void {
        IllegalArgumentException.assert(i != null);
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents());

        let components: string[] = this.asArray();
        components.splice(i, 1);
        this.noComponents = components.length;
        this.name = components.join(this.delimiter);
    }

    private asArray(): string[] {
        let components: string[] = [];
        let lastComponentStartIndex: number = 0;
        for (let i = 0; i < this.name.length; i++) {
            let curChar: string = this.name[i];
            // so which one takes priority in case delim == escape?
            // escape over delimiter, or delimiter over escape?
            if (curChar === ESCAPE_CHARACTER) {
                i += 1;
                continue;
            }
            if (curChar === this.delimiter) {
                components.push(this.name.substring(lastComponentStartIndex, i));
                lastComponentStartIndex = i + 1;
            }
        }
        // last component
        components.push(this.name.substring(lastComponentStartIndex));
        return components;
    }

}