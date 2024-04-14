import { JSDOM } from "jsdom";
import reader from "node:readline";
import parse from "./parse.mjs";
import { fetchTable } from "./fetch.mjs";

const rl = reader.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const main = async () => {
  const id = await new Promise((res, rej) => {
    rl.question("What`s your student ID?\n", (id) =>
      Number.isNaN(Number(id)) ? rej(new Error("Invalid ID")) : res(id)
    );
  }).finally(() => rl.close());

  console.log(`\n${Array.from(new Array(25)).join("-")}\n`);

  const table = await fetchTable(id);
  const dom = new JSDOM(table);
  const rows = dom.window.document.querySelectorAll("table tbody tr");
  const result = parse(rows);

  console.log(`Student ID: ${id}\n`, result);
};

main();
