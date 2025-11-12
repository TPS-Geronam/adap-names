import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.name = source;
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;
        this.noComponents = this.asArray().length;
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.asArray()
            .map(c => c.replaceAll(ESCAPE_CHARACTER, ""))
            .join(delimiter);
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

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.name === "" && this.noComponents === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        return this.asArray()[x];
    }

    public setComponent(n: number, c: string): void {
        let components: string[] = this.asArray();
        components[n] = c;
        this.name = components.join(this.delimiter);
    }

    public insert(n: number, c: string): void {
        let components: string[] = this.asArray();
        components.splice(n, 0, c);
        this.noComponents += 1;
        this.name = components.join(this.delimiter);
    }

    public append(c: string): void {
        this.noComponents += 1;
        this.name += `${this.delimiter}${c}`;
    }

    public remove(n: number): void {
        let components: string[] = this.asArray();
        components.splice(n, 1);
        this.noComponents = components.length;
        this.name = components.join(this.delimiter);
    }

    public concat(other: Name): void {
        let otherComponentCount: number = other.getNoComponents();
        for (let i = 0; i < otherComponentCount; i++) {
            let c: string = other.getComponent(i);
            this.append(c);
        }
    }

    private asArray(): string[] {
        let components: string[] = [];
        let lastComponentStartIndex = 0;
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