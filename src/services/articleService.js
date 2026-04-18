import Article from "../models/Article.js";

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildRegexFilter = (field, value) =>
  value ? { [field]: { $regex: escapeRegex(value), $options: "i" } } : {};

const buildSearchFilter = (search) => buildRegexFilter("title", search);

const getStats = async () => {
  const agg = await Article.aggregate([
    {
      $group: {
        _id: "$author",
        articleCount: { $sum: 1 },
        avgContentLength: { $avg: { $strLenCP: "$content" } },
        latestDate: { $max: "$date" },
      },
    },
    { $sort: { articleCount: -1 } },
    {
      $group: {
        _id: null,
        totalArticles: { $sum: "$articleCount" },
        uniqueAuthors: { $sum: 1 },
        avgContentLength: { $avg: "$avgContentLength" },
        perAuthor: {
          $push: {
            author: "$_id",
            articleCount: "$articleCount",
            avgContentLength: { $round: ["$avgContentLength", 0] },
            latestDate: "$latestDate",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalArticles: 1,
        uniqueAuthors: 1,
        avgContentLength: { $round: ["$avgContentLength", 0] },
        perAuthor: 1,
      },
    },
  ]);

  return (
    agg[0] || {
      totalArticles: 0,
      uniqueAuthors: 0,
      avgContentLength: 0,
      perAuthor: [],
    }
  );
};

const getAll = async (searchTerm = "", projection = {}) => {
  const filter = buildSearchFilter(searchTerm);
  return Article.find(filter, projection);
};

const getById = async (articleId) => {
  return Article.findById(articleId);
};

const create = async (data) => {
  return Article.create(data);
};

const createMany = async (articles) => {
  return Article.insertMany(articles, { ordered: false });
};

const updateById = async (articleId, data, options = {}) => {
  return Article.findByIdAndUpdate(
    articleId,
    { $set: data },
    { returnDocument: "after", runValidators: true, ...options },
  );
};

const replaceById = async (articleId, data) => {
  return Article.findByIdAndUpdate(articleId, data, {
    returnDocument: "after",
    overwrite: true,
    runValidators: true,
  });
};

const updateMany = async (filter, data) => {
  return Article.updateMany(filter, { $set: data }, { runValidators: true });
};

const deleteById = async (articleId) => {
  return Article.findByIdAndDelete(articleId);
};

const deleteMany = async (ids) => {
  return Article.deleteMany({ _id: { $in: ids } });
};

const stream = async (searchTerm = "") => {
  const filter = buildSearchFilter(searchTerm);
  const cursor = Article.find(filter).cursor();
  const articles = [];
  for await (const doc of cursor) {
    articles.push(doc);
  }
  return articles;
};

export {
  buildRegexFilter,
  buildSearchFilter,
  getStats,
  getAll,
  getById,
  create,
  createMany,
  updateById,
  replaceById,
  updateMany,
  deleteById,
  deleteMany,
  stream,
};
