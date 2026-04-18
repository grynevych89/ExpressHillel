import { isDbConnected } from "../db.js";
import { run as runArticleCrud } from "./article.crud.js";
import { run as runArticleModel } from "./article.model.js";
import { run as runUser } from "./user.js";

let testResults = [];
let testsRan = false;
let testRunAt = null;

const SUITES = [
  { label: "Article CRUD", run: runArticleCrud },
  { label: "Article Model", run: runArticleModel },
  { label: "User", run: runUser },
];

const runTests = async () => {
  const results = [];

  const makeTest = (suite) => async (name, fn) => {
    try {
      await fn();
      results.push({ suite, name, passed: true });
    } catch (err) {
      results.push({ suite, name, passed: false, error: err.message });
    }
  };

  await makeTest("General")("DB connected to MongoDB", async () => {
    if (!isDbConnected()) throw new Error("Not connected");
  });

  for (const suite of SUITES) {
    await suite.run(makeTest(suite.label));
  }

  testResults = results;
  testsRan = true;
  testRunAt = new Date().toISOString();

  const passed = results.filter((r) => r.passed).length;
  console.log(`\n[Tests] ${passed}/${results.length} passed`);
  results.forEach((r) => {
    const icon = r.passed ? "✓" : "✗";
    const detail = r.passed ? "" : ` — ${r.error}`;
    console.log(`  ${icon} ${r.name}${detail}`);
  });

  return results;
};

const getTestResults = () => testResults;
const hasTestsRan = () => testsRan;
const getTestRunAt = () => testRunAt;

export { runTests, getTestResults, hasTestsRan, getTestRunAt };
