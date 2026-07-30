import { expect, describe, it } from "vitest"
import { Tokenize, IsText, IsBracket, IsSpace } from "../src/Tokenizer"

describe("Tokenizer.Tokenize", () => {
  it("Test empty string", () => {
    expect(Tokenize("")).toStrictEqual([]);
  });

  it("Test single char", () => {
    expect(Tokenize("w")).toStrictEqual(["w"]);
  });

  it("Test single sign", () => {
    expect(Tokenize("\'")).toStrictEqual(["\'"]);
  });

  it("Test single space", () => {
    expect(Tokenize("\t")).toStrictEqual(["\t"]);
  });

  it("Test single bracket", () => {
    expect(Tokenize("(")).toStrictEqual(["("]);
  });
  
  it("Test long", () => {
    expect(Tokenize("  for(let i = 0; i < text.length + 1; ++i)")).toStrictEqual(["  ", "for", "(", "let", " ", "i", " ", "=", " ", "0", ";", " ", "i", " ", "<", " ", "text", ".", "length", " ", "+", " ", "1", ";", " ", "++", "i", ")"] );
  });
})

describe("Tokenizer.IsText", () => {
  it("Test letter", () => {
    expect(IsText("t")).toStrictEqual(true);
  })

  it("Test sign", () => {
    expect(IsText("\"")).toStrictEqual(false);
  })

  it("Test capital letter", () => {
    expect(IsText("T")).toStrictEqual(true);
  })

  it("Test underscore", () => {
    expect(IsText("_")).toStrictEqual(true);
  })

  it("Test number", () => {
    expect(IsText("0")).toStrictEqual(true);
  })

  it("Test space", () => {
    expect(IsText("\t")).toStrictEqual(false);
  })

  it("Test bracket", () => {
    expect(IsText("(")).toStrictEqual(false);
  })

  it("Test length", () => {
    expect(IsText("-0")).toStrictEqual(false);
  })
})

describe("Tokenizer.IsSpace", () => {
  it("Test letter", () => {
    expect(IsSpace("t")).toStrictEqual(false);
  })

  it("Test sign", () => {
    expect(IsSpace("\"")).toStrictEqual(false);
  })

  it("Test capital letter", () => {
    expect(IsSpace("T")).toStrictEqual(false);
  })

  it("Test underscore", () => {
    expect(IsSpace("_")).toStrictEqual(false);
  })

  it("Test number", () => {
    expect(IsSpace("0")).toStrictEqual(false);
  })

  it("Test space", () => {
    expect(IsSpace("\t")).toStrictEqual(true);
  })

  it("Test bracket", () => {
    expect(IsSpace("(")).toStrictEqual(false);
  })

  it("Test length", () => {
    expect(IsSpace("-0")).toStrictEqual(false);
  })
})

describe("Tokenizer.IsBracket", () => {
  it("Test letter", () => {
    expect(IsBracket("t")).toStrictEqual(false);
  })

  it("Test sign", () => {
    expect(IsBracket("\"")).toStrictEqual(false);
  })

  it("Test capital letter", () => {
    expect(IsBracket("T")).toStrictEqual(false);
  })

  it("Test underscore", () => {
    expect(IsBracket("_")).toStrictEqual(false);
  })

  it("Test number", () => {
    expect(IsBracket("0")).toStrictEqual(false);
  })

  it("Test space", () => {
    expect(IsBracket("\t")).toStrictEqual(false);
  })

  it("Test bracket", () => {
    expect(IsBracket("(")).toStrictEqual(true);
  })

  it("Test length", () => {
    expect(IsBracket("-0")).toStrictEqual(false);
  })
})