import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;
    }

    abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
        let components: string[] = [];
        let componentsCount: number = this.getNoComponents();
        for (let i = 0; i < componentsCount; i++) {
            components.push(this.getComponent(i));
        }
        return components
            .map(c => c.replaceAll(ESCAPE_CHARACTER, ""))
            .join(delimiter);
    }

    public toString(): string {
        return this.asString(this.delimiter);
    }

    abstract asDataString(): string;

    public isEqual(other: Name): boolean {
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
        return this.asString() === "" && this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        let otherComponentCount: number = other.getNoComponents();
        for (let i = 0; i < otherComponentCount; i++) {
            let c: string = other.getComponent(i);
            this.append(c);
        }
    }

}