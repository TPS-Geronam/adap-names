import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b06/names/Name";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";
import { IllegalArgumentException } from "../../../src/adap-b06/common/IllegalArgumentException";

describe("Basic StringName function tests", () => {
    it("test insert", () => {
        let n: Name = new StringName("oss.fau.de");
        n = n.insert(1, "cs");
        expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test append", () => {
        let n: Name = new StringName("oss.cs.fau");
        n = n.append("de");
        expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test remove", () => {
        let n: Name = new StringName("oss.cs.fau.de");
        n = n.remove(0);
        expect(n.asString()).toBe("cs.fau.de");
    });
});

describe("Basic StringArrayName function tests", () => {
    it("test insert", () => {
        let n: Name = new StringArrayName(["oss", "fau", "de"]);
        n = n.insert(1, "cs");
        expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test append", () => {
        let n: Name = new StringArrayName(["oss", "cs", "fau"]);
        n = n.append("de");
        expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test remove", () => {
        let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        n = n.remove(0);
        expect(n.asString()).toBe("cs.fau.de");
    });
});

describe("Delimiter function tests", () => {
    it("test insert", () => {
        let n: Name = new StringName("oss#fau#de", '#');
        n = n.insert(1, "cs");
        expect(n.asString()).toBe("oss#cs#fau#de");
    });
});

describe("Escape character extravaganza", () => {
    it("test escape and delimiter boundary conditions", () => {
        let n: Name = new StringName("oss.cs.fau.de", '#');
        expect(n.getNoComponents()).toBe(1);
        expect(n.asString()).toBe("oss.cs.fau.de");
        n = n.append("people");
        expect(n.asString()).toBe("oss.cs.fau.de#people");
    });
});

describe("Custom tests", () => {
    it("test given cases from class documentation (StringName)", () => {
        let n = new StringName("///", '/');
        expect(n.asString()).toBe("///");
        expect(n.getNoComponents()).toBe(4);
        n = n.append("people");
        expect(n.asString()).toBe("////people");

        n = new StringName("Oh\\.\\.\\.", '.');
        expect(n.getNoComponents()).toBe(1);

        n = new StringName("Oh\\\\.\\\\.\\\\.", '.');
        expect(n.getNoComponents()).toBe(4);
    });

    it("test given cases from class documentation (StringArrayName)", () => {
        let n = new StringArrayName(["", "", "", ""], '/');
        expect(n.asString()).toBe("///");
        n = n.append("people");
        expect(n.asString()).toBe("////people");

        n = new StringArrayName(["Oh\\.\\.\\."], '.');
        expect(n.getNoComponents()).toBe(1);
    });

    it("test concat and clone", () => {
        let n: Name = new StringArrayName(["", "", "", ""], '/');
        expect(n.asString()).toBe("///");
        n = n.append("people");
        expect(n.asString()).toBe("////people");

        let n2 = new StringArrayName(["Oh\\.\\.\\."], '.');
        expect(n2.getNoComponents()).toBe(1);

        n = n.concat(new StringArrayName(["a", "b", "c", "d"], '/'));
        expect(n.getNoComponents()).toBe(9);
        expect(n.asString()).toBe("////people/a/b/c/d");

        //let n3 = n.clone();
        //expect(n.asString()).toBe(n3.asString());
        //expect(n.asDataString()).toBe(n3.asDataString());
        //expect(n.getNoComponents()).toBe(n3.getNoComponents());

        let n4 = new StringName("my\\/name/other\\/name", "/");
        let n5 = n4.clone();
        expect(n4.asString()).toBe(n5.asString());
        expect(n4.asDataString()).toBe(n5.asDataString());
        expect(n4.getNoComponents()).toBe(n5.getNoComponents());
    });

    it("test immutability", () => {
        let n = new StringArrayName(["", "", "", ""], '/');
        let n2 = n.insert(1, "abc");
        let eq = n === n2;
        expect(eq).toBe(false);

        let n3 = new StringName("my\\/name/other\\/name", "/");
        let n4 = n3.remove(0);
        let eq2 = n3 === n4;
        expect(eq2).toBe(false);
    });

    const undefinedNumber = undefined as unknown as number;
    const nullNumber = null as unknown as number;
    const undefinedString = undefined as unknown as string;
    const nullString = null as unknown as string;
    const undefinedName = undefined as unknown as Name;
    const nullName = null as unknown as Name;

    it("test preconditions (constructors)", () => {
        expect(() => new StringName("oss.fau.de", "...")).toThrow(IllegalArgumentException);
        expect(() => new StringName("oss.fau.de", "")).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"], "...")).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"], "")).toThrow(IllegalArgumentException);

        expect(() => new StringName(undefinedString)).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(undefined as unknown as string[])).toThrow(IllegalArgumentException);
        expect(() => new StringName(nullString)).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(null as unknown as string[])).toThrow(IllegalArgumentException);
    });

    it("test preconditions (asString)", () => {
        expect(() => new StringName("oss.fau.de").asString("...")).toThrow(IllegalArgumentException);
        expect(() => new StringName("oss.fau.de").asString("")).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).asString("...")).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).asString("")).toThrow(IllegalArgumentException);
    });

    it("test preconditions (isEqual)", () => {
        expect(() => new StringName("oss.fau.de").isEqual(undefinedName)).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).isEqual(undefinedName)).toThrow(IllegalArgumentException);
        expect(() => new StringName("oss.fau.de").isEqual(nullName)).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).isEqual(nullName)).toThrow(IllegalArgumentException);
    });

    it("test preconditions (get-/setComponent)", () => {
        expect(() => new StringName("oss.fau.de").getComponent(undefinedNumber)).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).getComponent(undefinedNumber)).toThrow(IllegalArgumentException);
        expect(() => new StringName("oss.fau.de").getComponent(nullNumber)).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).getComponent(nullNumber)).toThrow(IllegalArgumentException);

        expect(() => new StringName("oss.fau.de").getComponent(-999)).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).getComponent(-999)).toThrow(IllegalArgumentException);

        expect(() => new StringName("oss.fau.de").setComponent(undefinedNumber, "")).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).setComponent(undefinedNumber, "")).toThrow(IllegalArgumentException);
        expect(() => new StringName("oss.fau.de").setComponent(nullNumber, "")).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).setComponent(nullNumber, "")).toThrow(IllegalArgumentException);
        expect(() => new StringName("oss.fau.de").setComponent(0, undefinedString)).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).setComponent(0, undefinedString)).toThrow(IllegalArgumentException);
        expect(() => new StringName("oss.fau.de").setComponent(0, nullString)).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).setComponent(0, nullString)).toThrow(IllegalArgumentException);

        expect(() => new StringName("oss.fau.de").setComponent(999, "")).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).setComponent(999, "")).toThrow(IllegalArgumentException);

        expect(() => new StringName("oss.fau.de").setComponent(0, "\\\\.abc")).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).setComponent(0, "\\\\.abc")).toThrow(IllegalArgumentException);
    });

    it("test preconditions (insert, append, remove)", () => {
        expect(() => new StringName("oss.fau.de").insert(undefinedNumber, "")).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).insert(undefinedNumber, "")).toThrow(IllegalArgumentException);
        expect(() => new StringName("oss.fau.de").insert(nullNumber, "")).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).insert(nullNumber, "")).toThrow(IllegalArgumentException);
        expect(() => new StringName("oss.fau.de").insert(0, undefinedString)).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).insert(0, undefinedString)).toThrow(IllegalArgumentException);
        expect(() => new StringName("oss.fau.de").insert(0, nullString)).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).insert(0, nullString)).toThrow(IllegalArgumentException);

        expect(() => new StringName("oss.fau.de").insert(999, "")).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).insert(999, "")).toThrow(IllegalArgumentException);

        let n: Name = new StringName("oss.fau.de");
        n = n.insert(1, "")
        expect(n.getNoComponents()).toBe(4);
        n = new StringArrayName(["oss"]);
        n = n.insert(1, "")
        expect(n.getNoComponents()).toBe(2);

        expect(() => new StringName("oss.fau.de").insert(0, "\\\\.abc")).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).insert(0, "\\\\.abc")).toThrow(IllegalArgumentException);

        expect(() => new StringName("oss.fau.de").append(undefinedString)).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).append(undefinedString)).toThrow(IllegalArgumentException);
        expect(() => new StringName("oss.fau.de").append(nullString)).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).append(nullString)).toThrow(IllegalArgumentException);

        expect(() => new StringName("oss.fau.de").append("\\\\.abc")).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).append(".a.b.c.")).toThrow(IllegalArgumentException);

        expect(() => new StringName("oss.fau.de").remove(undefinedNumber)).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).remove(undefinedNumber)).toThrow(IllegalArgumentException);
        expect(() => new StringName("oss.fau.de").remove(nullNumber)).toThrow(IllegalArgumentException);
        expect(() => new StringArrayName(["oss"]).remove(nullNumber)).toThrow(IllegalArgumentException);
    });
});
