export type Entry = {
  amount: number | null;
  merchant: string;
  note: string;
  day: "Today" | "Yesterday";
};

/**
 * Reads one sentence the way Outlayr's composer does, for the demo on the home page:
 * "lunch at chipotle 12 yesterday" → 12, "Chipotle", "lunch", "Yesterday".
 */
// shortcut: amount, merchant, note and today/yesterday only; the real app also reads categories, currencies and receipts.
export function parseEntry(text: string): Entry {
  let amount: number | null = null;
  let day: Entry["day"] = "Today";
  const rest: string[] = [];

  for (const word of text.trim().split(/\s+/).filter(Boolean)) {
    const money = /^\$?(\d+(?:[.,]\d{1,2})?)$/.exec(word);
    const lower = word.toLowerCase();
    if (money && amount === null) amount = Number(money[1].replace(",", "."));
    else if (lower === "today" || lower === "yesterday") day = lower === "today" ? "Today" : "Yesterday";
    else rest.push(word);
  }

  const at = rest.findIndex((word) => word.toLowerCase() === "at");
  const merchant = (at >= 0 ? rest.slice(at + 1) : rest).map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
  const note = at > 0 ? rest.slice(0, at).join(" ") : "";

  return { amount, merchant, note, day };
}
