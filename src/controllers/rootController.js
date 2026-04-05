import { getTestResults, hasTestsRan, getTestRunAt } from '../tests/runTests.js';

const getRoot = (req, res) => {
  const results = getTestResults();
  const passed = results.filter(r => r.passed).length;
  res.render('root/index.pug', {
    testResults: results,
    testsRan: hasTestsRan(),
    testRunAt: getTestRunAt(),
    testsPassed: passed,
    testsTotal: results.length,
  });
};

export { getRoot };
