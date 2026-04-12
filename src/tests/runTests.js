import Article from '../models/Article.js';
import { isDbConnected } from '../db.js';
import { buildSearchFilter, getStats } from '../services/articleService.js';

const TEST_PREFIX = '__test__';

let testResults = [];
let testsRan = false;
let testRunAt = null;

const runTests = async () => {
  const results = [];

  const test = async (name, fn) => {
    try {
      await fn();
      results.push({ name, passed: true });
    } catch (err) {
      results.push({ name, passed: false, error: err.message });
    }
  };

  await test('DB connected to MongoDB Atlas', async () => {
    if (!isDbConnected()) throw new Error('Not connected');
  });

  await test('Article.find() — read all', async () => {
    const articles = await Article.find({});
    if (!Array.isArray(articles)) throw new Error('Expected an array');
  });

  await test('Article.find() — partial title search ($regex)', async () => {
    const articles = await Article.find({ title: { $regex: 'a', $options: 'i' } });
    if (!Array.isArray(articles)) throw new Error('Expected an array');
  });

  await test('Article.find() — projection (select fields)', async () => {
    const articles = await Article.find({}, { title: 1, author: 1 });
    if (!Array.isArray(articles)) throw new Error('Expected an array');
  });

  let testId;
  await test('Article.create() — insert one', async () => {
    const article = await Article.create({
      title: `${TEST_PREFIX} Insert One`,
      author: 'Test Runner',
      date: '2024-01-01',
      content: 'Automated test article',
    });
    if (!article._id) throw new Error('No _id returned');
    testId = article._id;
  });

  await test('Article.findById() — read one by ID', async () => {
    if (!testId) throw new Error('No test article (insert failed)');
    const article = await Article.findById(testId);
    if (!article) throw new Error('Article not found by ID');
  });

  await test('Article.findByIdAndUpdate() — update one ($set)', async () => {
    if (!testId) throw new Error('No test article (insert failed)');
    const updated = await Article.findByIdAndUpdate(
      testId,
      { $set: { title: `${TEST_PREFIX} Updated` } },
      { returnDocument: 'after' }
    );
    if (!updated || updated.title !== `${TEST_PREFIX} Updated`) throw new Error('Title not updated');
  });

  await test('Article.findByIdAndUpdate() — replace one (overwrite: true)', async () => {
    if (!testId) throw new Error('No test article (insert failed)');
    const replaced = await Article.findByIdAndUpdate(
      testId,
      { title: `${TEST_PREFIX} Replaced`, author: 'Replaced', date: '2024-12-31', content: 'Replaced' },
      { returnDocument: 'after', overwrite: true }
    );
    if (!replaced) throw new Error('Replace returned null');
  });

  let bulkIds = [];
  await test('Article.insertMany() — insert many', async () => {
    const articles = await Article.insertMany([
      { title: `${TEST_PREFIX} Bulk 1`, author: 'Bulk Author', date: '2024-01-01', content: 'c1' },
      { title: `${TEST_PREFIX} Bulk 2`, author: 'Bulk Author', date: '2024-01-02', content: 'c2' },
    ]);
    if (articles.length !== 2) throw new Error(`Expected 2, got ${articles.length}`);
    bulkIds = articles.map(a => a._id);
  });

  await test('Article.updateMany() — update many ($in)', async () => {
    if (!bulkIds.length) throw new Error('No bulk articles (insert failed)');
    const result = await Article.updateMany(
      { _id: { $in: bulkIds } },
      { $set: { author: 'Updated Bulk Author' } }
    );
    if (result.modifiedCount < 1) throw new Error(`Modified ${result.modifiedCount}, expected ≥1`);
  });

  await test('Article.findByIdAndDelete() — delete one', async () => {
    if (!testId) throw new Error('No test article (insert failed)');
    const deleted = await Article.findByIdAndDelete(testId);
    if (!deleted) throw new Error('Delete returned null');
  });

  await test('Article.deleteMany() — delete many ($in)', async () => {
    if (!bulkIds.length) throw new Error('No bulk articles (insert failed)');
    const result = await Article.deleteMany({ _id: { $in: bulkIds } });
    if (result.deletedCount < 1) throw new Error(`Deleted ${result.deletedCount}, expected ≥1`);
  });

  await test('Article.cursor() — iterate with for await', async () => {
    const filter = buildSearchFilter('');
    const cursor = Article.find(filter).cursor();
    let count = 0;
    for await (const doc of cursor) {
      if (!doc._id) throw new Error('Document missing _id');
      count++;
    }
    if (count < 1) throw new Error('Cursor returned no documents');
  });

  await test('Article.aggregate() — stats pipeline', async () => {
    const stats = await getStats();
    if (typeof stats.totalArticles !== 'number') throw new Error('totalArticles is not a number');
    if (typeof stats.uniqueAuthors !== 'number') throw new Error('uniqueAuthors is not a number');
    if (!Array.isArray(stats.perAuthor)) throw new Error('perAuthor is not an array');
    if (stats.totalArticles < 1) throw new Error('No articles found in stats');
  });

  testResults = results;
  testsRan = true;
  testRunAt = new Date().toISOString();

  const passed = results.filter(r => r.passed).length;
  console.log(`\n[Tests] ${passed}/${results.length} passed`);
  results.forEach(r => {
    const icon = r.passed ? '✓' : '✗';
    const detail = r.passed ? '' : ` — ${r.error}`;
    console.log(`  ${icon} ${r.name}${detail}`);
  });

  return results;
};

const getTestResults = () => testResults;
const hasTestsRan = () => testsRan;
const getTestRunAt = () => testRunAt;

export { runTests, getTestResults, hasTestsRan, getTestRunAt };
