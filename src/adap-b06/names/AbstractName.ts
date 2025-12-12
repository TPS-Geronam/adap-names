import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        let delim: string = delimiter ?? DEFAULT_DELIMITER;
        IllegalArgumentException.assert(delim.length == 1);
        this.delimiter = delim;
    }

    abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
        let delim: string = delimiter ?? this.delimiter;
        IllegalArgumentException.assert(delim.length == 1);

        let components: string[] = [];
        let componentsCount: number = this.getNoComponents();
        for (let i = 0; i < componentsCount; i++) {
            components.push(this.getComponent(i));
        }
        return components
            .map(c => c.replaceAll(ESCAPE_CHARACTER, ""))
            .join(delim);
    }

    public toString(): string {
        return this.asString(this.delimiter);
    }

    abstract asDataString(): string;

    public isEqual(other: Name): boolean {
        IllegalArgumentException.assert(other != null);

        return this.getHashCode() === other.getHashCode();
    }

    public getHashCode(): number {
        // https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
        let hash = 0;
        for (const char of this.asDataString()) {
            hash = (hash << 5) - hash + char.charCodeAt(0);
            hash |= 0; // Constrain to 32bit integer
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): Name;

    abstract insert(i: number, c: string): Name;
    abstract append(c: string): Name;
    abstract remove(i: number): Name;

    public concat(other: Name): Name {
        IllegalArgumentException.assert(other != null);

        let originalComponentCount: number = this.getNoComponents();
        let otherComponentCount: number = other.getNoComponents();
        let curName: Name = this;
        for (let i = 0; i < otherComponentCount; i++) {
            let c: string = other.getComponent(i);
            curName = curName.append(c);
        }

        MethodFailedException.assert(
            curName.getNoComponents() == (originalComponentCount + otherComponentCount)
        );

        return curName;
    }

    protected isEscapedComponentString(c: string): boolean {
        let delim: string = this.getDelimiterCharacter();
        let neutralizedEscape: string = `${ESCAPE_CHARACTER}${ESCAPE_CHARACTER}`
        let escapedDelim: string = `${ESCAPE_CHARACTER}${delim}`

        let componentCleaned: string = c.replaceAll(neutralizedEscape, "");
        componentCleaned = componentCleaned.replaceAll(escapedDelim, "");
        return !componentCleaned.includes(delim);
    }

}