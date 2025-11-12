import { describe, it, expect } from "vitest";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER, Name } from "../../../src/adap-b01/names/Name";

describe("Basic initialization tests", () => {
  it("test construction 1", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Basic function tests", () => {
  it("test insert", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new Name(["oss", "fau", "de"], '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    // Original name string = "oss.cs.fau.de"
    let n: Name = new Name(["oss.cs.fau.de"], '#');
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});

describe("Custom tests", () => {
  it("test given cases from class documentation", () => {
    let n: Name = new Name(["", "", "", ""], '/');
    expect(n.asString()).toBe("///");
    n.append("people");
    expect(n.asString()).toBe("////people");

    n = new Name(["Oh\\.\\.\\."], '.');
    expect(n.getNoComponents()).toBe(1);
  });

  it("test own cases", () => {
    let n: Name = new Name(["1", "2", "3", "4"], ESCAPE_CHARACTER);
    expect(n.asString()).toBe(`1\\2\\3\\4`);
    expect(n.getNoComponents()).toBe(4);
    n.append("5");
    expect(n.asString()).toBe(`1\\2\\3\\4\\5`);
    expect(n.getNoComponents()).toBe(5);

    let delim: string = `${ESCAPE_CHARACTER}${ESCAPE_CHARACTER}`;
    n = new Name(["1", "2", "3", "4"], delim);
    expect(n.asString()).toBe(`1\\\\2\\\\3\\\\4`);
    expect(n.getNoComponents()).toBe(4);
    n.append("5");
    expect(n.asString()).toBe(`1\\\\2\\\\3\\\\4\\\\5`);
    expect(n.getNoComponents()).toBe(5);

    delim = `${ESCAPE_CHARACTER}${DEFAULT_DELIMITER}`;
    n = new Name(["1", "2", "3", "4"], delim);
    expect(n.asString()).toBe(`1\\.2\\.3\\.4`);
    expect(n.getNoComponents()).toBe(4);
    n.append("5");
    expect(n.asString()).toBe(`1\\.2\\.3\\.4\\.5`);
    expect(n.asString('+')).toBe(`1+2+3+4+5`);
    expect(n.getNoComponents()).toBe(5);

    n = new Name(["my/name", "other/name"], "/");
    expect(n.asString()).toBe("my/name/other/name");
    expect(n.getNoComponents()).toBe(2);
    expect(n.asDataString()).toBe("my\\/name/other\\/name");
    expect(n.asString('-')).toBe("my/name-other/name");
  });
});
