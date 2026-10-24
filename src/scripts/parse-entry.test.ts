import { describe, expect, test } from "bun:test";

import { parseEntry } from "./parse-entry";

describe("parseEntry", () => {
  test("merchant and amount", () => {
    expect(parseEntry("blue bottle 4.50")).toEqual({ amount: 4.5, merchant: "Blue Bottle", note: "", day: "Today" });
  });

  test("note before 'at', day word anywhere", () => {
    expect(parseEntry("lunch at chipotle 12 yesterday")).toEqual({
      amount: 12,
      merchant: "Chipotle",
      note: "lunch",
      day: "Yesterday",
    });
  });

  test("dollar sign and comma decimals", () => {
    expect(parseEntry("$3,20 bus").amount).toBe(3.2);
  });

  test("no amount yet", () => {
    expect(parseEntry("coffee")).toEqual({ amount: null, merchant: "Coffee", note: "", day: "Today" });
  });

  test("empty input", () => {
    expect(parseEntry("   ")).toEqual({ amount: null, merchant: "", note: "", day: "Today" });
  });
});
