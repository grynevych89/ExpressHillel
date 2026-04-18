import { isDbConnected } from '../db.js';
import { getTestResults, hasTestsRan, getTestRunAt } from '../tests/runTests.js';
import { getStats } from '../services/articleService.js';

const getRoot = async (req, res) => {
  const results = getTestResults();
  const passed = results.filter(r => r.passed).length;

  const suiteMap = results.reduce((acc, r) => {
    const key = r.suite || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});
  const testSuites = Object.entries(suiteMap).map(([label, items]) => ({
    label,
    passed: items.filter(r => r.passed).length,
    total: items.length,
    results: items,
  }));

  let stats = null;
  if (isDbConnected()) {
    try {
      stats = await getStats();
    } catch (err) {
      console.warn('[rootController] Failed to fetch stats:', err.message);
      stats = null;
    }
  }

  res.render('root/index.pug', {
    testSuites,
    testsRan: hasTestsRan(),
    testRunAt: getTestRunAt(),
    testsPassed: passed,
    testsTotal: results.length,
    stats,
  });
};

export { getRoot };
