import { JSDOM } from "jsdom";
import reader from "node:readline";
import parse from "./parse.mjs";
import { fetchTable } from "./fetch.mjs";

const rl = reader.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const read = () =>
  new Promise((res, rej) => {
    rl.question(
      `What's your StudentId & ExecId?\nWrite your answer separated by ':'\nExample: student_id:exec_id\n\n`,
      (answer) => {
        const [studentId, execId] = answer.split(":");

        if (Number.isNaN(Number(studentId)) || Number.isNaN(Number(execId)))
          rej(new Error("Invalid input"));

        res([Number(studentId), Number(execId)]);
      }
    );
  });

const main = async () => {
  const [studentId, execId] = await read().finally(() => rl.close());

  console.log(`\n${Array.from(new Array(25)).join("-")}\n`);

  const table = await fetchTable(studentId, execId);
  const dom = new JSDOM(table);
  const rows = dom.window.document.querySelectorAll("table tbody tr");
  const result = parse(rows);

  console.log(`Student ID: ${studentId}\n`, result);
};

main();
