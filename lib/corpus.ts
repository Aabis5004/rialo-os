import { readFileSync, readdirSync } from "fs";
import { join } from "path";

export function loadCorpus(): { source: string; text: string }[] {
  const dir = join(process.cwd(), "lib", "corpus");
  const files = readdirSync(dir).filter((f) => f.endsWith(".txt"));
  return files.map((f) => ({
    source: f.replace(/\.txt$/, "").replace(/-/g, " "),
    text: readFileSync(join(dir, f), "utf-8"),
  }));
}
