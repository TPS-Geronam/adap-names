import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b03/names/Name";
import { StringName } from "../../../src/adap-b03/names/StringName";
import { StringArrayName } from "../../../src/adap-b03/names/StringArrayName";

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});

describe("Custom tests", () => {
  it("test given cases from class documentation (StringName)", () => {
    let n = new StringName("///", '/');
    expect(n.asString()).toBe("///");
    expect(n.getNoComponents()).toBe(4);
    n.append("people");
    expect(n.asString()).toBe("////people");

    n = new StringName("Oh\\.\\.\\.", '.');
    expect(n.getNoComponents()).toBe(1);
    
    n = new StringName("Oh\\\\.\\\\.\\\\.", '.');
    expect(n.getNoComponents()).toBe(4);
  });

  it("test given cases from class documentation (StringArrayName)", () => {
    let n = new StringArrayName(["", "", "", ""], '/');
    expect(n.asString()).toBe("///");
    n.append("people");
    expect(n.asString()).toBe("////people");

    n = new StringArrayName(["Oh\\.\\.\\."], '.');
    expect(n.getNoComponents()).toBe(1);
  });

  it("test own cases", () => {
    let ESCAPE_CHARACTER: string = "\\";
    let DEFAULT_DELIMITER: string = ".";

    let n: Name = new StringArrayName(["1", "2", "3", "4"], ESCAPE_CHARACTER);
    expect(n.asString()).toBe(`1\\2\\3\\4`);
    expect(n.getNoComponents()).toBe(4);
    n.append("5");
    expect(n.asString()).toBe(`1\\2\\3\\4\\5`);
    expect(n.getNoComponents()).toBe(5);

    let delim: string = `${ESCAPE_CHARACTER}${ESCAPE_CHARACTER}`;
    n = new StringArrayName(["1", "2", "3", "4"], delim);
    expect(n.asString()).toBe(`1\\\\2\\\\3\\\\4`);
    expect(n.getNoComponents()).toBe(4);
    n.append("5");
    expect(n.asString()).toBe(`1\\\\2\\\\3\\\\4\\\\5`);
    expect(n.getNoComponents()).toBe(5);

    delim = `${ESCAPE_CHARACTER}${DEFAULT_DELIMITER}`;
    n = new StringArrayName(["1", "2", "3", "4"], delim);
    expect(n.asString()).toBe(`1\\.2\\.3\\.4`);
    expect(n.getNoComponents()).toBe(4);
    n.append("5");
    expect(n.asString()).toBe(`1\\.2\\.3\\.4\\.5`);
    expect(n.asString('+')).toBe(`1+2+3+4+5`);
    expect(n.getNoComponents()).toBe(5);

    n = new StringArrayName(["my/name", "other/name"], "/");
    expect(n.asString()).toBe("my/name/other/name");
    expect(n.getNoComponents()).toBe(2);
    expect(n.asDataString()).toBe("my\\/name/other\\/name");
    expect(n.asString('-')).toBe("my/name-other/name");

    n = new StringName("my\\/name/other\\/name", "/");
    expect(n.asString()).toBe("my/name/other/name");
    expect(n.getNoComponents()).toBe(2);
    expect(n.asDataString()).toBe("my\\/name/other\\/name");
    expect(n.asString('-')).toBe("my/name-other/name");
  });

  it("test concat and clone", () => {
    let n = new StringArrayName(["", "", "", ""], '/');
    expect(n.asString()).toBe("///");
    n.append("people");
    expect(n.asString()).toBe("////people");

    let n2 = new StringArrayName(["Oh\\.\\.\\."], '.');
    expect(n2.getNoComponents()).toBe(1);

    n.concat(new StringArrayName(["a", "b", "c", "d"], '/'));
    expect(n.getNoComponents()).toBe(9);
    expect(n.asString()).toBe("////people/a/b/c/d");

    let n3 = n.clone();
    expect(n.asString()).toBe(n3.asString());
    expect(n.asDataString()).toBe(n3.asDataString());
    expect(n.getNoComponents()).toBe(n3.getNoComponents());

    let n4 = new StringName("my\\/name/other\\/name", "/");
    let n5 = n4.clone();
    expect(n4.asString()).toBe(n5.asString());
    expect(n4.asDataString()).toBe(n5.asDataString());
    expect(n4.getNoComponents()).toBe(n5.getNoComponents());
  });
});
