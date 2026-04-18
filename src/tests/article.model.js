import Article from "../models/Article.js";

const TEST_PREFIX = "__test__";

export async function run(test) {
  // ─── Static methods ───────────────────────────────────────────────────────

  let articleId;
  await test("Article.create() — setup for model tests", async () => {
    const article = await Article.create({
      title: `${TEST_PREFIX} Model Test`,
      author: "Model Test Author",
      date: "2024-06-01",
      content: "Content for model method tests",
    });
    articleId = article._id;
  });

  await test("Article.findByTitle() — static case-insensitive search", async () => {
    if (!articleId) throw new Error("No test article (create failed)");
    const found = await Article.findByTitle("model test");
    if (!found.some((a) => String(a._id) === String(articleId)))
      throw new Error("findByTitle did not return the created article");
  });

  await test("Article.findByAuthor() — static case-insensitive search", async () => {
    if (!articleId) throw new Error("No test article (create failed)");
    const found = await Article.findByAuthor("model test author");
    if (!found.some((a) => String(a._id) === String(articleId)))
      throw new Error("findByAuthor did not return the created article");
  });

  // ─── Instance methods ─────────────────────────────────────────────────────

  await test("article.getSummary() — returns correct shape", async () => {
    if (!articleId) throw new Error("No test article (create failed)");
    const article = await Article.findById(articleId);
    const summary = article.getSummary();
    if (!summary._id) throw new Error("summary missing _id");
    if (!summary.title) throw new Error("summary missing title");
    if (!summary.contentPreview) throw new Error("summary missing contentPreview");
    if (summary.contentPreview.length > 103) throw new Error("contentPreview too long");
  });

  // ─── Timestamps ───────────────────────────────────────────────────────────

  await test("Article — createdAt/updatedAt set on create", async () => {
    if (!articleId) throw new Error("No test article (create failed)");
    const article = await Article.findById(articleId);
    if (!(article.createdAt instanceof Date)) throw new Error("createdAt is not a Date");
    if (!(article.updatedAt instanceof Date)) throw new Error("updatedAt is not a Date");
  });

  await test("Article — updatedAt changes after update", async () => {
    if (!articleId) throw new Error("No test article (create failed)");
    const before = await Article.findById(articleId);
    await new Promise((r) => setTimeout(r, 10));
    await Article.findByIdAndUpdate(articleId, { $set: { title: `${TEST_PREFIX} Model Updated` } });
    const after = await Article.findById(articleId);
    if (after.updatedAt <= before.updatedAt) throw new Error("updatedAt did not change");
  });

  await test("Article model test cleanup", async () => {
    if (articleId) await Article.findByIdAndDelete(articleId);
  });

  // ─── Validation ───────────────────────────────────────────────────────────

  await test("Article.create() — rejects title shorter than 3 chars", async () => {
    let threw = false;
    try {
      await Article.create({ title: "Ab", author: "Author", date: "2024-01-01", content: "Valid content here" });
    } catch (err) {
      if (err.name === "ValidationError") threw = true;
    }
    if (!threw) throw new Error("Expected ValidationError for short title");
  });

  await test("Article.create() — rejects missing required fields", async () => {
    let threw = false;
    try {
      await Article.create({ title: `${TEST_PREFIX} No Author` });
    } catch (err) {
      if (err.name === "ValidationError") threw = true;
    }
    if (!threw) throw new Error("Expected ValidationError for missing fields");
  });

  await test("Article.create() — rejects content shorter than 10 chars", async () => {
    let threw = false;
    try {
      await Article.create({ title: `${TEST_PREFIX} Bad Content`, author: "Author", date: "2024-01-01", content: "Short" });
    } catch (err) {
      if (err.name === "ValidationError") threw = true;
    }
    if (!threw) throw new Error("Expected ValidationError for short content");
  });
}
