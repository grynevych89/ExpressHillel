import { isDbConnected } from '../db.js';
import { getTestResults, hasTestsRan, getTestRunAt } from '../tests/runTests.js';
import { getStats } from '../services/articleService.js';

const getRoot = async (req, res) => {
  const results = getTestResults();
  const passed = results.filter(r => r.passed).length;

  let stats = null;
  if (isDbConnected()) {
    try {
      stats = await getStats();
    } catch {
      stats = null;
    }
  }

  res.render('root/index.pug', {
    testResults: results,
    testsRan: hasTestsRan(),
    testRunAt: getTestRunAt(),
    testsPassed: passed,
    testsTotal: results.length,
    stats,
  });
};

export { getRoot };
